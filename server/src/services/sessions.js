// server/src/services/sessions.js
// Server-Side Session Store.
// Guarantees that student and faculty identities are derived authoritatively from validated server sessions.
// 100% OFFLINE, ZERO CLOUD.

import { generateSecureToken } from '../utils/hashing.js';

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

class SessionService {
  constructor() {
    this.sessions = new Map();
  }

  /**
   * Create an authoritative server session
   */
  createSession(user) {
    const sessionId = generateSecureToken(32);
    const session = {
      sessionId,
      username: user.username,
      name: user.name,
      role: user.role,
      department: user.department,
      regNo: user.regNo,
      assignedSubjects: user.assignedSubjects || [],
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_TTL_MS
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Validate and retrieve session
   */
  getSession(sessionId) {
    if (!sessionId) return null;
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return null;
    }

    return session;
  }

  /**
   * Destroy session on logout
   */
  destroySession(sessionId) {
    if (sessionId) {
      this.sessions.delete(sessionId);
    }
  }

  /**
   * Invalidate all sessions for a user (e.g., upon password reset)
   */
  destroyUserSessions(username) {
    for (const [id, s] of this.sessions.entries()) {
      if (s.username === username) {
        this.sessions.delete(id);
      }
    }
  }
}

export const sessionService = new SessionService();
