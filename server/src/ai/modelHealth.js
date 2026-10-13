// server/src/ai/modelHealth.js
// Continuously monitors local AI runtime health, latency, and resource availability.
// 100% OFFLINE, ZERO CLOUD.

import { modelRegistry } from './modelRegistry.js';

class ModelHealthMonitor {
  constructor() {
    this.status = {
      healthy: false,
      lastCheck: null,
      latencyMs: null,
      consecutiveFailures: 0,
      activeRequests: 0,
      totalRequestsServed: 0,
      totalFailures: 0,
      recentLatencies: []
    };
    this.isChecking = false;
  }

  /**
   * Probe local Ollama service and record latency
   */
  async checkHealth() {
    if (this.isChecking) return this.status;
    this.isChecking = true;

    const start = Date.now();
    try {
      const discovery = await modelRegistry.discoverModels();
      const duration = Date.now() - start;

      if (discovery.available) {
        this.status.healthy = true;
        this.status.latencyMs = duration;
        this.status.consecutiveFailures = 0;
        this._recordLatency(duration);
      } else {
        this.status.healthy = false;
        this.status.latencyMs = null;
        this.status.consecutiveFailures++;
      }
    } catch (err) {
      this.status.healthy = false;
      this.status.latencyMs = null;
      this.status.consecutiveFailures++;
    } finally {
      this.status.lastCheck = new Date().toISOString();
      this.isChecking = false;
    }

    return this.getStatus();
  }

  trackRequestStart() {
    this.status.activeRequests++;
  }

  trackRequestEnd(success = true, durationMs = 0) {
    this.status.activeRequests = Math.max(0, this.status.activeRequests - 1);
    this.status.totalRequestsServed++;
    if (!success) {
      this.status.totalFailures++;
    } else if (durationMs > 0) {
      this._recordLatency(durationMs);
    }
  }

  _recordLatency(ms) {
    this.status.recentLatencies.push(ms);
    if (this.status.recentLatencies.length > 20) {
      this.status.recentLatencies.shift();
    }
  }

  getAverageLatency() {
    if (this.status.recentLatencies.length === 0) return 0;
    const sum = this.status.recentLatencies.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.status.recentLatencies.length);
  }

  getStatus() {
    const manifest = modelRegistry.getStatusManifest();
    return {
      ...this.status,
      averageLatencyMs: this.getAverageLatency(),
      manifest
    };
  }
}

export const modelHealth = new ModelHealthMonitor();
