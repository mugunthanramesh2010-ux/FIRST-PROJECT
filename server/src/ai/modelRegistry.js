// server/src/ai/modelRegistry.js
// Discovers, catalogues, and assigns roles to locally installed Ollama AI models.
// 100% OFFLINE, ZERO CLOUD.

const OLLAMA_BASE_URL = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';

export const TASK_ROLES = {
  FAST: 'fast',
  REASONING: 'reasoning',
  REVIEW: 'review',
  EMBEDDING: 'embedding',
  VISION: 'vision'
};

// Known local model profiles and their operational characteristics
const MODEL_PROFILES = {
  'llama3.2:1b': {
    family: 'llama',
    role: TASK_ROLES.FAST,
    contextWindow: 4096,
    speedScore: 98,
    reasoningScore: 78,
    strengths: ['Low latency', 'Concept-specific short questions', 'Taxonomy classification', 'Progressive hints']
  },
  'llama3.2:latest': {
    family: 'llama',
    role: TASK_ROLES.REASONING,
    contextWindow: 8192,
    speedScore: 82,
    reasoningScore: 91,
    strengths: ['Balanced reasoning', 'Conceptual analysis', 'Indirect hints', 'Structured evaluation']
  },
  'llama3:latest': {
    family: 'llama',
    role: TASK_ROLES.REASONING,
    contextWindow: 8192,
    speedScore: 72,
    reasoningScore: 95,
    strengths: ['Deep reasoning', 'Mathematical derivations', 'Misconception analysis', 'Multi-step proofs']
  },
  'qwen2.5:1.5b': {
    family: 'qwen',
    role: TASK_ROLES.FAST,
    contextWindow: 8192,
    speedScore: 95,
    reasoningScore: 82,
    strengths: ['Fast structured output', 'Code reasoning', 'STEM definitions']
  },
  'qwen2.5:3b': {
    family: 'qwen',
    role: TASK_ROLES.REASONING,
    contextWindow: 8192,
    speedScore: 85,
    reasoningScore: 92,
    strengths: ['Complex derivations', 'Circuit reasoning', 'Mathematical checks']
  }
};

class ModelRegistry {
  constructor() {
    this.installedModels = [];
    this.roleAssignments = {
      [TASK_ROLES.FAST]: 'llama3.2:1b',
      [TASK_ROLES.REASONING]: 'llama3.2:latest',
      [TASK_ROLES.REVIEW]: 'llama3:latest',
      [TASK_ROLES.EMBEDDING]: null,
      [TASK_ROLES.VISION]: null
    };
    this.lastDiscovered = null;
    this.preferredModel = 'llama3.2:1b';
  }

  /**
   * Discover installed models from Ollama runtime
   */
  async discoverModels() {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Ollama returned status ${res.status}`);
      }

      const data = await res.json();
      const rawModels = (data.models || []).map(m => m.name);
      this.installedModels = rawModels;
      this.lastDiscovered = new Date().toISOString();

      this._recomputeAssignments();
      return {
        available: true,
        installedModels: this.installedModels,
        assignments: this.roleAssignments,
        lastDiscovered: this.lastDiscovered
      };
    } catch (err) {
      this.installedModels = [];
      return {
        available: false,
        installedModels: [],
        assignments: this.roleAssignments,
        error: err.message,
        fallbackMode: 'procedural_ontology'
      };
    }
  }

  /**
   * Intelligently map discovered models to tasks
   */
  _recomputeAssignments() {
    const list = this.installedModels;
    if (list.length === 0) return;

    // Fast model: Prefer 1b, then 1.5b, then first available
    const fast = list.find(m => m.includes('1b') || m.includes('1.5b')) || list[0];
    this.roleAssignments[TASK_ROLES.FAST] = fast;

    // Reasoning model: Prefer 3b, 7b, or standard llama3
    const reasoning = list.find(m => m === 'llama3:latest' || m.includes('3b') || m.includes('7b') || m.includes('llama3.2:latest')) || fast;
    this.roleAssignments[TASK_ROLES.REASONING] = reasoning;

    // Reviewer model: A different model if available, otherwise reasoning model
    const reviewer = list.find(m => m !== reasoning && (m.includes('llama') || m.includes('qwen'))) || reasoning;
    this.roleAssignments[TASK_ROLES.REVIEW] = reviewer;

    // Vision model: Check if llava or minicpm is installed
    const vision = list.find(m => m.includes('llava') || m.includes('vision')) || null;
    this.roleAssignments[TASK_ROLES.VISION] = vision;

    // Embedding model: Check if nomic-embed or bge is installed
    const embed = list.find(m => m.includes('embed') || m.includes('nomic')) || null;
    this.roleAssignments[TASK_ROLES.EMBEDDING] = embed;

    this.preferredModel = fast;
  }

  /**
   * Get model assigned to a specific role
   */
  getModelForRole(role) {
    return this.roleAssignments[role] || this.preferredModel || 'llama3.2:1b';
  }

  /**
   * Get metadata profile for a model
   */
  getModelProfile(modelName) {
    return MODEL_PROFILES[modelName] || {
      family: 'custom',
      role: TASK_ROLES.REASONING,
      contextWindow: 4096,
      speedScore: 70,
      reasoningScore: 80,
      strengths: ['General Local Inference']
    };
  }

  /**
   * Get user-visible AI status manifest
   */
  getStatusManifest() {
    return {
      ollamaUrl: OLLAMA_BASE_URL,
      isOnline: this.installedModels.length > 0,
      installedModels: this.installedModels,
      roleAssignments: this.roleAssignments,
      preferredModel: this.preferredModel,
      lastDiscovered: this.lastDiscovered,
      aiMode: this.installedModels.length > 0 ? 'local_ollama_orchestrated' : 'airgap_procedural_ontology',
      offlineGuaranteed: true
    };
  }
}

export const modelRegistry = new ModelRegistry();
