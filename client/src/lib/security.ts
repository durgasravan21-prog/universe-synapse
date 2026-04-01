/**
 * Security Utilities
 * Comprehensive security functions for data protection and validation
 */

import CryptoJS from 'crypto-js';

/**
 * Data Encryption and Decryption
 */
export class DataEncryption {
  private static readonly SECRET_KEY = process.env.VITE_ENCRYPTION_KEY || 'default-secret-key-change-in-production';

  /**
   * Encrypt sensitive data
   */
  static encrypt(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, this.SECRET_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return data;
    }
  }

  /**
   * Decrypt sensitive data
   */
  static decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedData;
    }
  }

  /**
   * Hash sensitive data (one-way)
   */
  static hash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }
}

/**
 * Input Validation and Sanitization
 */
export class InputValidator {
  /**
   * Sanitize HTML to prevent XSS attacks
   */
  static sanitizeHTML(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  /**
   * Validate university email domain
   */
  static isValidUniversityEmail(email: string, universityDomain: string): boolean {
    return email.toLowerCase().endsWith(`@${universityDomain.toLowerCase()}`);
  }

  /**
   * Validate password strength
   */
  static isStrongPassword(password: string): {
    isStrong: boolean;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let isStrong = true;

    if (password.length < 12) {
      feedback.push('Password must be at least 12 characters long');
      isStrong = false;
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push('Password must contain at least one uppercase letter');
      isStrong = false;
    }

    if (!/[a-z]/.test(password)) {
      feedback.push('Password must contain at least one lowercase letter');
      isStrong = false;
    }

    if (!/[0-9]/.test(password)) {
      feedback.push('Password must contain at least one number');
      isStrong = false;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      feedback.push('Password must contain at least one special character');
      isStrong = false;
    }

    return { isStrong, feedback };
  }

  /**
   * Validate phone number
   */
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate URL format
   */
  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Sanitize user input to prevent injection attacks
   */
  static sanitizeInput(input: string, maxLength: number = 1000): string {
    return input
      .substring(0, maxLength)
      .replace(/[<>\"']/g, '') // Remove dangerous characters
      .trim();
  }

  /**
   * Validate file upload
   */
  static isValidFileUpload(file: File, allowedTypes: string[], maxSizeMB: number = 10): {
    isValid: boolean;
    error?: string;
  } {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      return {
        isValid: false,
        error: `File size exceeds ${maxSizeMB}MB limit`,
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }

    return { isValid: true };
  }
}

/**
 * CSRF Protection
 */
export class CSRFProtection {
  private static readonly TOKEN_KEY = 'csrf_token';

  /**
   * Generate CSRF token
   */
  static generateToken(): string {
    const token = CryptoJS.lib.WordArray.random(16).toString();
    sessionStorage.setItem(this.TOKEN_KEY, token);
    return token;
  }

  /**
   * Get CSRF token
   */
  static getToken(): string {
    let token = sessionStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      token = this.generateToken();
    }
    return token;
  }

  /**
   * Verify CSRF token
   */
  static verifyToken(token: string): boolean {
    const storedToken = sessionStorage.getItem(this.TOKEN_KEY);
    return storedToken === token;
  }
}

/**
 * Rate Limiting
 */
export class RateLimiter {
  private static readonly STORAGE_KEY = 'rate_limit_';
  private static readonly DEFAULT_LIMIT = 5;
  private static readonly DEFAULT_WINDOW_MS = 60000; // 1 minute

  /**
   * Check if action is rate limited
   */
  static isLimited(
    action: string,
    limit: number = this.DEFAULT_LIMIT,
    windowMs: number = this.DEFAULT_WINDOW_MS
  ): boolean {
    const key = `${this.STORAGE_KEY}${action}`;
    const now = Date.now();
    const data = localStorage.getItem(key);

    if (!data) {
      localStorage.setItem(key, JSON.stringify({ count: 1, resetTime: now + windowMs }));
      return false;
    }

    const parsed = JSON.parse(data);

    if (now > parsed.resetTime) {
      localStorage.setItem(key, JSON.stringify({ count: 1, resetTime: now + windowMs }));
      return false;
    }

    if (parsed.count >= limit) {
      return true;
    }

    parsed.count++;
    localStorage.setItem(key, JSON.stringify(parsed));
    return false;
  }

  /**
   * Get remaining attempts
   */
  static getRemainingAttempts(
    action: string,
    limit: number = this.DEFAULT_LIMIT
  ): number {
    const key = `${this.STORAGE_KEY}${action}`;
    const data = localStorage.getItem(key);

    if (!data) {
      return limit;
    }

    const parsed = JSON.parse(data);
    return Math.max(0, limit - parsed.count);
  }

  /**
   * Reset rate limit
   */
  static reset(action: string): void {
    const key = `${this.STORAGE_KEY}${action}`;
    localStorage.removeItem(key);
  }
}

/**
 * Session Security
 */
export class SessionSecurity {
  private static readonly SESSION_KEY = 'user_session';
  private static readonly SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
  private static lastActivityTime = Date.now();

  /**
   * Create secure session
   */
  static createSession(userId: string, userEmail: string): void {
    const sessionData = {
      userId,
      userEmail,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.SESSION_TIMEOUT_MS,
      token: CryptoJS.lib.WordArray.random(32).toString(),
    };

    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    this.lastActivityTime = Date.now();
  }

  /**
   * Get session data
   */
  static getSession(): any {
    const session = sessionStorage.getItem(this.SESSION_KEY);
    if (!session) {
      return null;
    }

    const sessionData = JSON.parse(session);

    // Check if session has expired
    if (Date.now() > sessionData.expiresAt) {
      this.destroySession();
      return null;
    }

    // Check for inactivity timeout
    if (Date.now() - this.lastActivityTime > this.SESSION_TIMEOUT_MS) {
      this.destroySession();
      return null;
    }

    this.lastActivityTime = Date.now();
    return sessionData;
  }

  /**
   * Destroy session
   */
  static destroySession(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  /**
   * Verify session is active
   */
  static isSessionActive(): boolean {
    return this.getSession() !== null;
  }
}

/**
 * Audit Logging
 */
export class AuditLogger {
  private static readonly LOG_KEY = 'audit_logs';
  private static readonly MAX_LOGS = 1000;

  /**
   * Log security event
   */
  static logEvent(
    eventType: string,
    userId: string,
    action: string,
    details: any,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ): void {
    const event = {
      timestamp: new Date().toISOString(),
      eventType,
      userId,
      action,
      details,
      severity,
      ipAddress: 'client-side', // In production, get from server
      userAgent: navigator.userAgent,
    };

    try {
      const logs = JSON.parse(localStorage.getItem(this.LOG_KEY) || '[]');
      logs.push(event);

      // Keep only recent logs
      if (logs.length > this.MAX_LOGS) {
        logs.shift();
      }

      localStorage.setItem(this.LOG_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  }

  /**
   * Get audit logs
   */
  static getLogs(limit: number = 100): any[] {
    try {
      const logs = JSON.parse(localStorage.getItem(this.LOG_KEY) || '[]');
      return logs.slice(-limit);
    } catch {
      return [];
    }
  }

  /**
   * Clear audit logs
   */
  static clearLogs(): void {
    localStorage.removeItem(this.LOG_KEY);
  }
}

/**
 * Security Headers Helper
 */
export class SecurityHeaders {
  /**
   * Get recommended security headers for backend
   */
  static getRecommendedHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    };
  }
}

export default {
  DataEncryption,
  InputValidator,
  CSRFProtection,
  RateLimiter,
  SessionSecurity,
  AuditLogger,
  SecurityHeaders,
};
