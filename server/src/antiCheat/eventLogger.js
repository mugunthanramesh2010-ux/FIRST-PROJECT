// server/src/antiCheat/eventLogger.js
// Anti-Malpractice Telemetry Logger with Tamper-Evident SHA-256 Hash Chaining.
// 100% OFFLINE, ZERO CLOUD.

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const AUDIT_DIR = path.resolve(process.cwd(), 'Viva_Records', 'Audit_Logs');
const AUDIT_CHAIN_FILE = path.join(AUDIT_DIR, 'audit_chain.jsonl');

class EventLogger {
  constructor() {
    this.ensureDir();
    this.lastHash = this.getLastHash();
    this.eventIndex = this.getEventCount();
  }

  ensureDir() {
    if (!fs.existsSync(AUDIT_DIR)) {
      fs.mkdirSync(AUDIT_DIR, { recursive: true });
    }
  }

  getLastHash() {
    this.ensureDir();
    if (!fs.existsSync(AUDIT_CHAIN_FILE)) return 'GENESIS_HASH_0000000000000000000000000000000000000000000000000000000000000000';
    try {
      const lines = fs.readFileSync(AUDIT_CHAIN_FILE, 'utf-8').trim().split('\n').filter(Boolean);
      if (lines.length > 0) {
        const lastRecord = JSON.parse(lines[lines.length - 1]);
        return lastRecord.currentHash || 'GENESIS_HASH';
      }
    } catch (e) {}
    return 'GENESIS_HASH_0000000000000000000000000000000000000000000000000000000000000000';
  }

  getEventCount() {
    if (!fs.existsSync(AUDIT_CHAIN_FILE)) return 0;
    try {
      const lines = fs.readFileSync(AUDIT_CHAIN_FILE, 'utf-8').trim().split('\n').filter(Boolean);
      return lines.length;
    } catch (e) {}
    return 0;
  }

  /**
   * Log an anti-malpractice or assessment event with hash chaining
   */
  logEvent(eventType, eventData = {}, sessionId = 'SYSTEM', studentId = 'UNKNOWN') {
    this.ensureDir();
    this.eventIndex++;
    const timestamp = new Date().toISOString();
    const prevHash = this.lastHash;

    const dataPayload = JSON.stringify(eventData);
    const hashInput = `${this.eventIndex}|${timestamp}|${sessionId}|${studentId}|${eventType}|${dataPayload}|${prevHash}`;
    const currentHash = crypto.createHash('sha256').update(hashInput).digest('hex');

    const entry = {
      index: this.eventIndex,
      timestamp,
      sessionId,
      studentId,
      eventType,
      eventData,
      prevHash,
      currentHash
    };

    fs.appendFileSync(AUDIT_CHAIN_FILE, JSON.stringify(entry) + '\n', 'utf-8');
    this.lastHash = currentHash;

    return entry;
  }

  /**
   * Cryptographically verify integrity of the entire audit chain
   */
  verifyAuditChain() {
    if (!fs.existsSync(AUDIT_CHAIN_FILE)) {
      return { verified: true, count: 0, message: 'Audit chain is empty.' };
    }

    const lines = fs.readFileSync(AUDIT_CHAIN_FILE, 'utf-8').trim().split('\n').filter(Boolean);
    let expectedPrevHash = 'GENESIS_HASH_0000000000000000000000000000000000000000000000000000000000000000';

    for (let i = 0; i < lines.length; i++) {
      const entry = JSON.parse(lines[i]);
      if (entry.prevHash !== expectedPrevHash) {
        return {
          verified: false,
          brokenAtIndex: entry.index,
          error: `Hash chain broken at event ${entry.index}: expected prevHash ${expectedPrevHash}, found ${entry.prevHash}`
        };
      }

      const dataPayload = JSON.stringify(entry.eventData);
      const hashInput = `${entry.index}|${entry.timestamp}|${entry.sessionId}|${entry.studentId}|${entry.eventType}|${dataPayload}|${entry.prevHash}`;
      const recomputedHash = crypto.createHash('sha256').update(hashInput).digest('hex');

      if (recomputedHash !== entry.currentHash) {
        return {
          verified: false,
          tamperedAtIndex: entry.index,
          error: `Data tampering detected at event ${entry.index}: hash mismatch`
        };
      }

      expectedPrevHash = entry.currentHash;
    }

    return {
      verified: true,
      count: lines.length,
      lastHash: expectedPrevHash,
      message: `Audit chain verified successfully across all ${lines.length} events.`
    };
  }
}

export const eventLogger = new EventLogger();
