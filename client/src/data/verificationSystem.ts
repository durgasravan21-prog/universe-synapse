/**
 * University Verification System
 * Handles two-step verification with tokens, status tracking, and approval workflow
 */

export type VerificationStatus = 'pending' | 'email_verified' | 'awaiting_approval' | 'approved' | 'rejected';
export type VerificationStep = 'step1_email_verification' | 'step2_admin_approval';

export interface VerificationToken {
  id: string;
  universityId: string;
  email: string;
  code: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  verified: boolean;
  verifiedAt?: Date;
}

export interface UniversityRegistration {
  id: string;
  universityName: string;
  email: string;
  contactPerson: string;
  phone: string;
  website: string;
  
  // Verification tracking
  verificationStatus: VerificationStatus;
  currentStep: VerificationStep;
  
  // Step 1: Email Verification
  emailVerificationToken?: VerificationToken;
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  
  // Step 2: Admin Approval
  adminApprovalPendingSince?: Date;
  adminApprovalDeadline?: Date; // 2-3 days from verification
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvalReason?: string;
  approvedBy?: string;
  approvedAt?: Date;
  
  // Credentials (after approval)
  adminEmail?: string;
  adminId?: string;
  synapseDomain?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  rejectionCount: number;
  lastRejectionReason?: string;
}

/**
 * Generate verification token
 */
export function generateVerificationToken(): { code: string; token: string } {
  const code = Math.random().toString().slice(2, 8).toUpperCase();
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return { code, token };
}

/**
 * Create new university registration
 */
export function createUniversityRegistration(
  universityName: string,
  email: string,
  contactPerson: string,
  phone: string,
  website: string
): UniversityRegistration {
  const { code, token } = generateVerificationToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  return {
    id: `uni_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    universityName,
    email,
    contactPerson,
    phone,
    website,
    verificationStatus: 'pending',
    currentStep: 'step1_email_verification',
    emailVerified: false,
    approvalStatus: 'pending',
    emailVerificationToken: {
      id: `token_${Date.now()}`,
      universityId: '',
      email,
      code,
      token,
      createdAt: now,
      expiresAt,
      verified: false,
    },
    createdAt: now,
    updatedAt: now,
    rejectionCount: 0,
  };
}

/**
 * Verify email with token or code
 */
export function verifyEmailToken(
  registration: UniversityRegistration,
  input: string
): { success: boolean; message: string; registration?: UniversityRegistration } {
  if (!registration.emailVerificationToken) {
    return { success: false, message: 'No verification token found' };
  }

  const token = registration.emailVerificationToken;
  const now = new Date();

  // Check if token has expired
  if (now > token.expiresAt) {
    return { success: false, message: 'Verification token has expired. Please request a new one.' };
  }

  // Check if input matches code or token
  const isMatch = input === token.code || input === token.token;
  if (!isMatch) {
    return { success: false, message: 'Invalid verification code. Please try again.' };
  }

  // Mark as verified
  token.verified = true;
  token.verifiedAt = now;

  const updatedRegistration: UniversityRegistration = {
    ...registration,
    emailVerified: true,
    emailVerifiedAt: now,
    verificationStatus: 'email_verified',
    currentStep: 'step2_admin_approval',
    adminApprovalPendingSince: now,
    adminApprovalDeadline: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
    updatedAt: now,
  };

  return {
    success: true,
    message: 'Email verified successfully. Your application is now under review.',
    registration: updatedRegistration,
  };
}

/**
 * Check if approval deadline has passed
 */
export function isApprovalDeadlinePassed(registration: UniversityRegistration): boolean {
  if (!registration.adminApprovalDeadline) return false;
  return new Date() > registration.adminApprovalDeadline;
}

/**
 * Get days remaining for approval
 */
export function getDaysRemainingForApproval(registration: UniversityRegistration): number {
  if (!registration.adminApprovalDeadline) return 0;
  const now = new Date();
  const diffTime = registration.adminApprovalDeadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Approve university registration
 */
export function approveUniversityRegistration(
  registration: UniversityRegistration,
  approvedBy: string
): UniversityRegistration {
  const now = new Date();
  const adminNumber = Math.floor(Math.random() * 999) + 1;
  const adminEmail = `${registration.universityName.toLowerCase().replace(/\s+/g, '')}.admin.${String(adminNumber).padStart(3, '0')}@synapse.in`;
  const adminId = `ADMIN_${registration.id.substring(0, 8).toUpperCase()}`;

  return {
    ...registration,
    approvalStatus: 'approved',
    approvedBy,
    approvedAt: now,
    verificationStatus: 'approved',
    adminEmail,
    adminId,
    synapseDomain: 'synapse.in',
    updatedAt: now,
  };
}

/**
 * Reject university registration
 */
export function rejectUniversityRegistration(
  registration: UniversityRegistration,
  reason: string,
  rejectedBy: string
): UniversityRegistration {
  const now = new Date();

  return {
    ...registration,
    approvalStatus: 'rejected',
    approvalReason: reason,
    approvedBy: rejectedBy,
    approvedAt: now,
    verificationStatus: 'rejected',
    lastRejectionReason: reason,
    rejectionCount: registration.rejectionCount + 1,
    updatedAt: now,
  };
}

/**
 * Get verification status display text
 */
export function getVerificationStatusText(status: VerificationStatus): string {
  const statusMap: Record<VerificationStatus, string> = {
    pending: 'Registration Initiated',
    email_verified: 'Email Verified - Awaiting Admin Approval',
    awaiting_approval: 'Under Review',
    approved: 'Approved - Active',
    rejected: 'Rejected',
  };
  return statusMap[status] || 'Unknown';
}

/**
 * Get verification step display text
 */
export function getVerificationStepText(step: VerificationStep): string {
  const stepMap: Record<VerificationStep, string> = {
    step1_email_verification: 'Step 1: Email Verification',
    step2_admin_approval: 'Step 2: Admin Approval',
  };
  return stepMap[step] || 'Unknown Step';
}

/**
 * Check if registration can be resubmitted
 */
export function canResubmitRegistration(registration: UniversityRegistration): boolean {
  return registration.approvalStatus === 'rejected' && registration.rejectionCount < 3;
}

/**
 * Get registration progress percentage
 */
export function getRegistrationProgress(registration: UniversityRegistration): number {
  if (registration.verificationStatus === 'pending') return 25;
  if (registration.verificationStatus === 'email_verified') return 50;
  if (registration.verificationStatus === 'awaiting_approval') return 75;
  if (registration.verificationStatus === 'approved') return 100;
  if (registration.verificationStatus === 'rejected') return 0;
  return 0;
}
