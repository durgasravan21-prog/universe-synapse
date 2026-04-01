/**
 * OTP (One-Time Password) System
 * Handles OTP generation, validation, and tracking
 */

export interface OTPRecord {
  id: string;
  email: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
  verified: boolean;
  verifiedAt?: Date;
  universityId?: string;
  universityName?: string;
}

export interface OTPVerificationResult {
  success: boolean;
  message: string;
  verified?: boolean;
  remainingAttempts?: number;
}

/**
 * Generate a random 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Create a new OTP record
 */
export function createOTPRecord(
  email: string,
  universityId?: string,
  universityName?: string
): OTPRecord {
  const otp = generateOTP();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes expiry

  return {
    id: `otp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email,
    otp,
    createdAt: now,
    expiresAt,
    attempts: 0,
    maxAttempts: 5,
    verified: false,
    universityId,
    universityName,
  };
}

/**
 * Verify OTP
 */
export function verifyOTP(
  record: OTPRecord,
  inputOTP: string
): OTPVerificationResult {
  // Check if OTP has expired
  if (new Date() > record.expiresAt) {
    return {
      success: false,
      message: 'OTP has expired. Please request a new one.',
      remainingAttempts: record.maxAttempts - record.attempts,
    };
  }

  // Check if max attempts exceeded
  if (record.attempts >= record.maxAttempts) {
    return {
      success: false,
      message: 'Maximum OTP verification attempts exceeded. Please request a new OTP.',
      remainingAttempts: 0,
    };
  }

  // Check if OTP matches
  if (record.otp === inputOTP) {
    record.verified = true;
    record.verifiedAt = new Date();
    return {
      success: true,
      message: 'Email verified successfully!',
      verified: true,
      remainingAttempts: record.maxAttempts - record.attempts,
    };
  }

  // Increment attempts
  record.attempts += 1;
  const remainingAttempts = record.maxAttempts - record.attempts;

  return {
    success: false,
    message: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
    remainingAttempts,
  };
}

/**
 * Check if OTP is still valid
 */
export function isOTPValid(record: OTPRecord): boolean {
  return (
    !record.verified &&
    new Date() <= record.expiresAt &&
    record.attempts < record.maxAttempts
  );
}

/**
 * Get time remaining for OTP expiry (in seconds)
 */
export function getOTPTimeRemaining(record: OTPRecord): number {
  const now = new Date();
  const timeRemaining = record.expiresAt.getTime() - now.getTime();
  return Math.max(0, Math.floor(timeRemaining / 1000));
}

/**
 * Format time remaining as MM:SS
 */
export function formatTimeRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Simulate sending OTP email
 * In production, this would integrate with email service like SendGrid, AWS SES, etc.
 */
export function simulateSendOTPEmail(
  email: string,
  otp: string,
  universityName: string
): Promise<boolean> {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      console.log(`[OTP EMAIL SENT] To: ${email}`);
      console.log(`[OTP CODE] ${otp}`);
      console.log(`[UNIVERSITY] ${universityName}`);
      resolve(true);
    }, 1000);
  });
}

/**
 * OTP Storage Manager (using localStorage for demo)
 */
export class OTPManager {
  private static readonly STORAGE_KEY = 'synapse_otp_records';

  /**
   * Store OTP record
   */
  static storeOTP(record: OTPRecord): void {
    const records = this.getAllOTPs();
    records.push(record);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
  }

  /**
   * Get OTP record by email
   */
  static getOTPByEmail(email: string): OTPRecord | null {
    const records = this.getAllOTPs();
    const record = records.find(r => r.email === email);
    return record || null;
  }

  /**
   * Get all OTP records
   */
  static getAllOTPs(): OTPRecord[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    try {
      const records = JSON.parse(data);
      // Convert date strings back to Date objects
      return records.map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt),
        expiresAt: new Date(r.expiresAt),
        verifiedAt: r.verifiedAt ? new Date(r.verifiedAt) : undefined,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Update OTP record
   */
  static updateOTP(record: OTPRecord): void {
    const records = this.getAllOTPs();
    const index = records.findIndex(r => r.id === record.id);
    if (index !== -1) {
      records[index] = record;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
    }
  }

  /**
   * Delete OTP record
   */
  static deleteOTP(email: string): void {
    const records = this.getAllOTPs();
    const filtered = records.filter(r => r.email !== email);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  /**
   * Clean up expired OTPs
   */
  static cleanupExpiredOTPs(): void {
    const records = this.getAllOTPs();
    const now = new Date();
    const filtered = records.filter(r => r.expiresAt > now);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  /**
   * Clear all OTP records (for testing)
   */
  static clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if email domain matches university domain
 */
export function validateUniversityEmailDomain(
  email: string,
  universityDomain: string
): boolean {
  const emailDomain = email.split('@')[1]?.toLowerCase();
  const expectedDomain = universityDomain.toLowerCase();
  return emailDomain === expectedDomain;
}
