/**
 * Registration Status Tracking System
 * Tracks university registration progress through approval workflow
 */

import { EmailNotificationService, EmailNotificationTemplates } from './emailNotificationService';

export type RegistrationStage = 'submitted' | 'email-verified' | 'under-review' | 'approved' | 'rejected';

export interface RegistrationStatusEvent {
  stage: RegistrationStage;
  timestamp: Date;
  description: string;
  details?: string;
  completedAt?: Date;
  estimatedCompletionTime?: number; // in hours
}

export interface RegistrationStatus {
  registrationId: string;
  universityName: string;
  universityId: string;
  adminEmail: string;
  adminName: string;
  registrationDate: Date;
  currentStage: RegistrationStage;
  progress: number; // 0-100
  events: RegistrationStatusEvent[];
  estimatedApprovalDate?: Date;
  approvalDate?: Date;
  rejectionReason?: string;
  rejectionDate?: Date;
  lastUpdated: Date;
}

export const STAGE_LABELS: Record<RegistrationStage, string> = {
  'submitted': 'Registration Submitted',
  'email-verified': 'Email Verified',
  'under-review': 'Under Review',
  'approved': 'Approved',
  'rejected': 'Rejected',
};

export const STAGE_DESCRIPTIONS: Record<RegistrationStage, string> = {
  'submitted': 'Your registration has been submitted successfully',
  'email-verified': 'Your university email has been verified',
  'under-review': 'Our team is reviewing your registration',
  'approved': 'Your registration has been approved!',
  'rejected': 'Your registration was not approved',
};

export const STAGE_COLORS: Record<RegistrationStage, string> = {
  'submitted': 'bg-blue-100 text-blue-700 border-blue-300',
  'email-verified': 'bg-green-100 text-green-700 border-green-300',
  'under-review': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'approved': 'bg-emerald-100 text-emerald-700 border-emerald-300',
  'rejected': 'bg-red-100 text-red-700 border-red-300',
};

export const STAGE_ICONS: Record<RegistrationStage, string> = {
  'submitted': '📝',
  'email-verified': '✓',
  'under-review': '🔍',
  'approved': '✅',
  'rejected': '❌',
};

/**
 * Registration Status Manager
 */
export class RegistrationStatusManager {
  private static readonly STORAGE_KEY = 'synapse_registration_status';
  private static readonly TRACKING_KEY = 'synapse_registration_tracking';

  /**
   * Create new registration status
   */
  static createRegistrationStatus(
    universityName: string,
    universityId: string,
    adminEmail: string,
    adminName: string
  ): RegistrationStatus {
    const registrationId = `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    const status: RegistrationStatus = {
      registrationId,
      universityName,
      universityId,
      adminEmail,
      adminName,
      registrationDate: now,
      currentStage: 'submitted',
      progress: 20,
      events: [
        {
          stage: 'submitted',
          timestamp: now,
          description: 'Registration submitted successfully',
          details: `Registration for ${universityName} has been received`,
          completedAt: now,
        },
      ],
      estimatedApprovalDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
      lastUpdated: now,
    };

    this.storeStatus(status);

    // Send registration submitted email
    const template = EmailNotificationTemplates.registrationSubmitted(universityName, status.registrationId);
    EmailNotificationService.sendEmailNotification(
      status.registrationId,
      adminEmail,
      'registration-submitted',
      template.subject,
      template.htmlContent,
      template.plainTextContent
    );

    return status;
  }

  /**
   * Store registration status
   */
  static storeStatus(status: RegistrationStatus): void {
    const statuses = this.getAllStatuses();
    const index = statuses.findIndex(s => s.registrationId === status.registrationId);
    if (index !== -1) {
      statuses[index] = status;
    } else {
      statuses.push(status);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(statuses));
  }

  /**
   * Get all registration statuses
   */
  static getAllStatuses(): RegistrationStatus[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    try {
      const statuses = JSON.parse(data);
      return statuses.map((s: any) => ({
        ...s,
        registrationDate: new Date(s.registrationDate),
        estimatedApprovalDate: s.estimatedApprovalDate ? new Date(s.estimatedApprovalDate) : undefined,
        approvalDate: s.approvalDate ? new Date(s.approvalDate) : undefined,
        rejectionDate: s.rejectionDate ? new Date(s.rejectionDate) : undefined,
        lastUpdated: new Date(s.lastUpdated),
        events: s.events.map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp),
          completedAt: e.completedAt ? new Date(e.completedAt) : undefined,
        })),
      }));
    } catch {
      return [];
    }
  }

  /**
   * Get status by registration ID
   */
  static getStatusById(registrationId: string): RegistrationStatus | null {
    const statuses = this.getAllStatuses();
    return statuses.find(s => s.registrationId === registrationId) || null;
  }

  /**
   * Get status by email
   */
  static getStatusByEmail(email: string): RegistrationStatus | null {
    const statuses = this.getAllStatuses();
    return statuses.find(s => s.adminEmail === email) || null;
  }

  /**
   * Update registration stage
   */
  static updateStage(registrationId: string, newStage: RegistrationStage, details?: string): boolean {
    const status = this.getStatusById(registrationId);
    if (!status) return false;

    const now = new Date();
    const stageProgress: Record<RegistrationStage, number> = {
      'submitted': 20,
      'email-verified': 40,
      'under-review': 60,
      'approved': 100,
      'rejected': 0,
    };

    status.currentStage = newStage;
    status.progress = stageProgress[newStage];
    status.lastUpdated = now;

    const event: RegistrationStatusEvent = {
      stage: newStage,
      timestamp: now,
      description: STAGE_DESCRIPTIONS[newStage],
      details,
      completedAt: now,
    };

    status.events.push(event);

    if (newStage === 'approved') {
      status.approvalDate = now;
      status.progress = 100;
    } else if (newStage === 'rejected') {
      status.rejectionDate = now;
      status.rejectionReason = details;
      status.progress = 0;
    }

    this.storeStatus(status);
    return true;
  }

  /**
   * Get progress percentage
   */
  static getProgress(registrationId: string): number {
    const status = this.getStatusById(registrationId);
    return status?.progress || 0;
  }

  /**
   * Get time remaining for approval
   */
  static getTimeRemaining(registrationId: string): { days: number; hours: number; minutes: number } | null {
    const status = this.getStatusById(registrationId);
    if (!status || !status.estimatedApprovalDate) return null;

    const now = new Date();
    const diff = status.estimatedApprovalDate.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  }

  /**
   * Get formatted status message
   */
  static getStatusMessage(registrationId: string): string {
    const status = this.getStatusById(registrationId);
    if (!status) return 'Status not found';

    if (status.currentStage === 'approved') {
      return `✅ Your registration has been approved! You can now access the platform.`;
    } else if (status.currentStage === 'rejected') {
      return `❌ Your registration was not approved. Reason: ${status.rejectionReason || 'Not specified'}`;
    } else if (status.currentStage === 'under-review') {
      const timeRemaining = this.getTimeRemaining(registrationId);
      if (timeRemaining) {
        return `🔍 Your registration is under review. Estimated completion in ${timeRemaining.days} days and ${timeRemaining.hours} hours.`;
      }
      return '🔍 Your registration is under review.';
    } else if (status.currentStage === 'email-verified') {
      return '✓ Your email has been verified. Your registration is being processed.';
    } else {
      return '📝 Your registration has been submitted and is being processed.';
    }
  }

  /**
   * Get all events for a registration
   */
  static getEvents(registrationId: string): RegistrationStatusEvent[] {
    const status = this.getStatusById(registrationId);
    return status?.events || [];
  }

  /**
   * Simulate stage progression (for demo)
   */
  static simulateProgress(registrationId: string): void {
    const status = this.getStatusById(registrationId);
    if (!status) return;

    const stageProgression: RegistrationStage[] = [
      'submitted',
      'email-verified',
      'under-review',
      'approved',
    ];

    const currentIndex = stageProgression.indexOf(status.currentStage);
    if (currentIndex < stageProgression.length - 1) {
      const nextStage = stageProgression[currentIndex + 1];
      this.updateStage(registrationId, nextStage, `Automatically progressed to ${nextStage}`);
    }
  }

  /**
   * Clear all statuses (for testing)
   */
  static clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
