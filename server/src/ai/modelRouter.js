// server/src/ai/modelRouter.js
// Central Orchestrator & Task-Based Router for Local Ollama AI Models.
// 100% OFFLINE, ZERO CLOUD.

import { modelRegistry, TASK_ROLES } from './modelRegistry.js';
import { modelHealth } from './modelHealth.js';
import { taskClassifier, TASK_TYPES } from './taskClassifier.js';
import { modelPolicy } from './modelPolicy.js';

const OLLAMA_BASE_URL = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';

export class ModelRouter {
  /**
   * Execute an assessment task through the appropriate local model
   * @param {string} taskType - Key from TASK_TYPES
   * @param {string} prompt - Assessment prompt
   * @param {object} options - Context, temperature, systemPrompt, etc.
   */
  async executeTask(taskType, prompt, options = {}) {
    const startTime = Date.now();
    const requirements = taskClassifier.classify(taskType, options);
    const assignedModel = options.modelOverride || modelRegistry.getModelForRole(requirements.role);

    // If no models are installed or Ollama was discovered offline, fast-path to offline fallback
    if (modelRegistry.installedModels.length === 0) {
      return {
        success: false,
        fallbackRequired: true,
        error: 'Local Ollama runtime offline. Active mode: airgap procedural ontology.',
        telemetry: {
          taskType,
          fallbackUsed: true,
          provider: 'offline_fallback'
        }
      };
    }

    modelPolicy.assertZeroCloud(`${OLLAMA_BASE_URL}/api/generate`);
    modelHealth.trackRequestStart();
    await modelPolicy.acquireWorkerSlot();

    let attempts = 0;
    const maxAttempts = modelPolicy.maxRetries + 1;
    let lastError = null;
    let rawResponse = null;
    let chosenModel = assignedModel;
    let fallbackUsed = false;

    try {
      while (attempts < maxAttempts) {
        attempts++;
        try {
          const controller = new AbortController();
          const timeoutMs = options.timeoutMs || requirements.timeoutMs;
          const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

          const payload = {
            model: chosenModel,
            prompt: prompt,
            system: options.systemPrompt || 'You are an authoritative oral viva examiner. Return strictly valid JSON.',
            stream: false,
            format: 'json',
            options: {
              temperature: options.temperature ?? requirements.temperature,
              num_predict: requirements.maxTokens,
              top_p: 0.9,
              num_ctx: 4096
            }
          };

          const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (!res.ok) {
            const errBody = await res.text();
            throw new Error(`Ollama returned status ${res.status}: ${errBody}`);
          }

          const resData = await res.json();
          rawResponse = resData.response;
          break; // Successful call
        } catch (err) {
          lastError = err;
          // If connection refused, Ollama daemon is offline -> break immediately
          if (err.cause?.code === 'ECONNREFUSED' || err.message?.includes('fetch failed') || err.message?.includes('ECONNREFUSED')) {
            modelRegistry.installedModels = [];
            break;
          }
          // If first attempt with reasoning model failed or timed out, try falling back to fast model
          if (attempts === 1 && chosenModel !== modelRegistry.getModelForRole(TASK_ROLES.FAST)) {
            chosenModel = modelRegistry.getModelForRole(TASK_ROLES.FAST);
            fallbackUsed = true;
          }
        }
      }

      const durationMs = Date.now() - startTime;

      if (!rawResponse) {
        // Ollama offline or all attempts exhausted -> Clean procedural fallback flag
        modelHealth.trackRequestEnd(false, durationMs);
        return {
          success: false,
          fallbackRequired: true,
          error: lastError ? lastError.message : 'Local model invocation exhausted',
          telemetry: {
            taskType,
            attemptedModel: chosenModel,
            durationMs,
            fallbackUsed: true,
            provider: 'offline_fallback'
          }
        };
      }

      modelHealth.trackRequestEnd(true, durationMs);

      // Attempt to parse structured JSON
      let parsedJson = null;
      try {
        parsedJson = JSON.parse(rawResponse);
      } catch (jsonErr) {
        // Clean markdown code blocks if Ollama included them
        const cleaned = rawResponse.replace(/```json\s*/gi, '').replace(/```\s*$/g, '').trim();
        try {
          parsedJson = JSON.parse(cleaned);
        } catch (e) {
          parsedJson = { rawText: rawResponse };
        }
      }

      return {
        success: true,
        data: parsedJson,
        raw: rawResponse,
        telemetry: {
          taskType,
          model: chosenModel,
          role: requirements.role,
          durationMs,
          fallbackUsed,
          provider: 'ollama'
        }
      };
    } finally {
      modelPolicy.releaseWorkerSlot();
    }
  }

  /**
   * Run an independent secondary review for high-impact or ambiguous answers
   */
  async runIndependentReview(primaryEvaluation, question, studentAnswer) {
    const reviewerModel = modelRegistry.getModelForRole(TASK_ROLES.REVIEW);
    if (!reviewerModel || reviewerModel === primaryEvaluation.telemetry?.model) {
      return { reviewed: false, consensus: true, note: 'No separate review model configured' };
    }

    const reviewPrompt = `You are a Senior Academic Reviewer.
Verify whether the following evaluation of a student's viva answer is fair, mathematically sound, and grounded in the question concept.

Question: "${question.questionText || question.text}"
Concept: "${question.conceptId || question.topic}"
Student Answer: "${studentAnswer}"
Primary Evaluator Result: Score ${primaryEvaluation.score}/100, Feedback: "${primaryEvaluation.feedback}"

Return JSON:
{
  "concursWithScore": true,
  "confidenceScore": 90,
  "adjustedScore": 85,
  "reviewRemarks": "Detailed analytical remark"
}`;

    const res = await this.executeTask(TASK_TYPES.INDEPENDENT_REVIEW, reviewPrompt, {
      modelOverride: reviewerModel,
      temperature: 0.1
    });

    if (res.success && res.data) {
      return {
        reviewed: true,
        reviewerModel,
        consensus: res.data.concursWithScore ?? true,
        adjustedScore: res.data.adjustedScore ?? primaryEvaluation.score,
        remarks: res.data.reviewRemarks || 'Independent review complete'
      };
    }

    return { reviewed: false, consensus: true, error: res.error };
  }
}

export const modelRouter = new ModelRouter();
