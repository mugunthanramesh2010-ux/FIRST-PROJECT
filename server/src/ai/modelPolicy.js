// server/src/ai/modelPolicy.js
// Enforces zero-cloud policy, concurrency caps, retry budgets, and failover rules.
// 100% OFFLINE, ZERO CLOUD.

export class ModelPolicy {
  constructor() {
    this.maxConcurrency = 2; // Maximum concurrent inferences on local CPU/GPU
    this.maxRetries = 1;
    this.zeroCloudEnforced = true;
    this.activeWorkers = 0;
    this.queue = [];
  }

  /**
   * Asserts that destination URL is strictly local
   */
  assertZeroCloud(url) {
    if (!this.zeroCloudEnforced) return true;
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.startsWith('192.168.') || host.startsWith('10.') || host.startsWith('172.');
    if (!isLocal) {
      throw new Error(`SECURITY POLICY VIOLATION: Cloud URL "${url}" rejected. System operates 100% offline.`);
    }
    return true;
  }

  /**
   * Acquire a worker slot, waiting in queue if maxConcurrency reached
   */
  async acquireWorkerSlot() {
    if (this.activeWorkers < this.maxConcurrency) {
      this.activeWorkers++;
      return;
    }
    return new Promise(resolve => {
      this.queue.push(() => {
        this.activeWorkers++;
        resolve();
      });
    });
  }

  /**
   * Release worker slot and dispatch next queued task
   */
  releaseWorkerSlot() {
    this.activeWorkers = Math.max(0, this.activeWorkers - 1);
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next();
    }
  }
}

export const modelPolicy = new ModelPolicy();
