// server/src/services/accounts.js
// Local file-based authenticated accounts repository.
// Enforces PBKDF2 salt-hashed passwords, role separation, and offline password recovery.
// 100% OFFLINE, ZERO CLOUD.

import fs from 'fs';
import path from 'path';
import { hashPassword, verifyPassword, hashToken, generateSecureToken } from '../utils/hashing.js';

const ACCOUNTS_DIR = path.resolve(process.cwd(), 'Viva_Records', 'Accounts');
const ACCOUNTS_FILE = path.join(ACCOUNTS_DIR, 'users.json');

class AccountService {
  constructor() {
    this.ensureDir();
    this.accounts = this.loadAccounts();
    this.initDefaultFaculty();
  }

  ensureDir() {
    if (!fs.existsSync(ACCOUNTS_DIR)) {
      fs.mkdirSync(ACCOUNTS_DIR, { recursive: true });
    }
  }

  loadAccounts() {
    this.ensureDir();
    if (fs.existsSync(ACCOUNTS_FILE)) {
      try {
        const raw = fs.readFileSync(ACCOUNTS_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (e) {
        console.error('Failed to load accounts.json, initializing empty:', e);
      }
    }
    return {};
  }

  saveAccounts() {
    this.ensureDir();
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(this.accounts, null, 2), 'utf-8');
  }

  initDefaultFaculty() {
    // Seed default offline faculty account if not exists
    if (!this.accounts['faculty']) {
      this.accounts['faculty'] = {
        username: 'faculty',
        name: 'Lead Faculty Examiner',
        role: 'faculty',
        department: 'ECE',
        passwordHash: hashPassword('faculty123'),
        assignedSubjects: ['Control Systems', 'Digital Electronics', 'VLSI Design', 'Universal Domain'],
        createdAt: new Date().toISOString()
      };
      this.saveAccounts();
    }
  }

  /**
   * Register a new user
   */
  register(userData) {
    const username = String(userData.username || '').trim().toLowerCase();
    const role = userData.role === 'faculty' ? 'faculty' : 'student';

    if (!username || username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters long.' };
    }
    if (!userData.password || userData.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    if (this.accounts[username]) {
      return { success: false, error: 'An account with this username already exists.' };
    }

    const newAccount = {
      username,
      name: userData.name || (role === 'faculty' ? 'Faculty Member' : 'Student'),
      role,
      department: userData.department || 'Engineering',
      regNo: userData.regNo || (role === 'student' ? username.toUpperCase() : null),
      passwordHash: hashPassword(userData.password),
      assignedSubjects: userData.assignedSubjects || ['Universal Domain'],
      createdAt: new Date().toISOString()
    };

    this.accounts[username] = newAccount;
    this.saveAccounts();

    return {
      success: true,
      user: {
        username: newAccount.username,
        name: newAccount.name,
        role: newAccount.role,
        department: newAccount.department,
        regNo: newAccount.regNo
      }
    };
  }

  /**
   * Authenticate user credentials
   */
  authenticate(username, password) {
    const cleanUser = String(username || '').trim().toLowerCase();
    const account = this.accounts[cleanUser];

    if (!account) {
      return { success: false, error: 'Invalid credentials.' };
    }

    const isValid = verifyPassword(password, account.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid credentials.' };
    }

    return {
      success: true,
      user: {
        username: account.username,
        name: account.name,
        role: account.role,
        department: account.department,
        regNo: account.regNo,
        assignedSubjects: account.assignedSubjects || []
      }
    };
  }

  /**
   * Generate an offline one-time recovery token for account
   */
  generateRecoveryToken(username) {
    const cleanUser = String(username || '').trim().toLowerCase();
    const account = this.accounts[cleanUser];
    if (!account) {
      // Return ambiguous message to avoid account enumeration
      return { success: true, message: 'If the account exists, an authorization token has been generated.' };
    }

    const rawToken = generateSecureToken(16);
    account.recoveryTokenHash = hashToken(rawToken);
    account.recoveryTokenExpires = Date.now() + (15 * 60 * 1000); // 15 minutes validity
    this.saveAccounts();

    return {
      success: true,
      recoveryToken: rawToken, // Displayed to administrator / faculty for offline recovery
      expiresInMinutes: 15
    };
  }

  /**
   * Reset password using offline recovery token
   */
  resetPasswordWithToken(username, token, newPassword) {
    const cleanUser = String(username || '').trim().toLowerCase();
    const account = this.accounts[cleanUser];

    if (!account || !account.recoveryTokenHash) {
      return { success: false, error: 'Invalid or expired recovery authorization.' };
    }

    if (Date.now() > (account.recoveryTokenExpires || 0)) {
      account.recoveryTokenHash = null;
      this.saveAccounts();
      return { success: false, error: 'Recovery token has expired. Request a new one.' };
    }

    const incomingHash = hashToken(token);
    if (incomingHash !== account.recoveryTokenHash) {
      return { success: false, error: 'Invalid recovery token.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    // Set new password and invalidate recovery token
    account.passwordHash = hashPassword(newPassword);
    account.recoveryTokenHash = null;
    account.recoveryTokenExpires = null;
    this.saveAccounts();

    return { success: true, message: 'Password has been reset successfully.' };
  }

  getAccount(username) {
    const cleanUser = String(username || '').trim().toLowerCase();
    const acc = this.accounts[cleanUser];
    if (!acc) return null;
    return {
      username: acc.username,
      name: acc.name,
      role: acc.role,
      department: acc.department,
      regNo: acc.regNo,
      assignedSubjects: acc.assignedSubjects || []
    };
  }
}

export const accountService = new AccountService();
