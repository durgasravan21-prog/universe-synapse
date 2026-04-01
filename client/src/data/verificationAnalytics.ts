/**
 * Verification Analytics System
 * Tracks and calculates metrics for university registration and verification
 */

export interface VerificationRecord {
  id: string;
  universityName: string;
  universityId: string;
  adminEmail: string;
  adminName: string;
  registrationDate: Date;
  emailVerifiedDate?: Date;
  approvalDate?: Date;
  rejectionDate?: Date;
  status: 'pending' | 'email-verified' | 'approved' | 'rejected';
  rejectionReason?: string;
  otpAttempts: number;
  verificationTimeMinutes?: number;
  approvalTimeHours?: number;
}

export interface VerificationMetrics {
  totalRegistrations: number;
  emailVerified: number;
  approved: number;
  rejected: number;
  pending: number;
  verificationRate: number;
  approvalRate: number;
  averageVerificationTime: number;
  averageApprovalTime: number;
  rejectionRate: number;
  todayRegistrations: number;
  weeklyRegistrations: number;
  monthlyRegistrations: number;
}

export interface ApprovalTrend {
  date: string;
  registrations: number;
  verified: number;
  approved: number;
  rejected: number;
}

/**
 * Verification Analytics Manager
 */
export class VerificationAnalyticsManager {
  private static readonly STORAGE_KEY = 'synapse_verification_records';

  /**
   * Store verification record
   */
  static storeRecord(record: VerificationRecord): void {
    const records = this.getAllRecords();
    records.push(record);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
  }

  /**
   * Get all verification records
   */
  static getAllRecords(): VerificationRecord[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    try {
      const records = JSON.parse(data);
      return records.map((r: any) => ({
        ...r,
        registrationDate: new Date(r.registrationDate),
        emailVerifiedDate: r.emailVerifiedDate ? new Date(r.emailVerifiedDate) : undefined,
        approvalDate: r.approvalDate ? new Date(r.approvalDate) : undefined,
        rejectionDate: r.rejectionDate ? new Date(r.rejectionDate) : undefined,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Update verification record
   */
  static updateRecord(record: VerificationRecord): void {
    const records = this.getAllRecords();
    const index = records.findIndex(r => r.id === record.id);
    if (index !== -1) {
      records[index] = record;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
    }
  }

  /**
   * Get record by ID
   */
  static getRecordById(id: string): VerificationRecord | null {
    const records = this.getAllRecords();
    return records.find(r => r.id === id) || null;
  }

  /**
   * Get records by status
   */
  static getRecordsByStatus(status: VerificationRecord['status']): VerificationRecord[] {
    const records = this.getAllRecords();
    return records.filter(r => r.status === status);
  }

  /**
   * Calculate verification metrics
   */
  static calculateMetrics(): VerificationMetrics {
    const records = this.getAllRecords();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const emailVerified = records.filter(r => r.status !== 'pending').length;
    const approved = records.filter(r => r.status === 'approved').length;
    const rejected = records.filter(r => r.status === 'rejected').length;
    const pending = records.filter(r => r.status === 'pending').length;

    const todayRegistrations = records.filter(r => r.registrationDate >= todayStart).length;
    const weeklyRegistrations = records.filter(r => r.registrationDate >= weekAgo).length;
    const monthlyRegistrations = records.filter(r => r.registrationDate >= monthAgo).length;

    // Calculate average times
    const verifiedRecords = records.filter(r => r.emailVerifiedDate && r.verificationTimeMinutes);
    const averageVerificationTime = verifiedRecords.length > 0
      ? verifiedRecords.reduce((sum, r) => sum + (r.verificationTimeMinutes || 0), 0) / verifiedRecords.length
      : 0;

    const approvedRecords = records.filter(r => r.approvalDate && r.approvalTimeHours);
    const averageApprovalTime = approvedRecords.length > 0
      ? approvedRecords.reduce((sum, r) => sum + (r.approvalTimeHours || 0), 0) / approvedRecords.length
      : 0;

    return {
      totalRegistrations: records.length,
      emailVerified,
      approved,
      rejected,
      pending,
      verificationRate: records.length > 0 ? (emailVerified / records.length) * 100 : 0,
      approvalRate: emailVerified > 0 ? (approved / emailVerified) * 100 : 0,
      rejectionRate: emailVerified > 0 ? (rejected / emailVerified) * 100 : 0,
      averageVerificationTime,
      averageApprovalTime,
      todayRegistrations,
      weeklyRegistrations,
      monthlyRegistrations,
    };
  }

  /**
   * Get approval trends for the last 30 days
   */
  static getApprovalTrends(): ApprovalTrend[] {
    const records = this.getAllRecords();
    const trends: { [key: string]: ApprovalTrend } = {};

    // Generate last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      trends[dateStr] = {
        date: dateStr,
        registrations: 0,
        verified: 0,
        approved: 0,
        rejected: 0,
      };
    }

    // Populate trends
    records.forEach(record => {
      const regDateStr = record.registrationDate.toISOString().split('T')[0];
      if (trends[regDateStr]) {
        trends[regDateStr].registrations += 1;
      }

      if (record.emailVerifiedDate) {
        const verDateStr = record.emailVerifiedDate.toISOString().split('T')[0];
        if (trends[verDateStr]) {
          trends[verDateStr].verified += 1;
        }
      }

      if (record.approvalDate) {
        const appDateStr = record.approvalDate.toISOString().split('T')[0];
        if (trends[appDateStr]) {
          trends[appDateStr].approved += 1;
        }
      }

      if (record.rejectionDate) {
        const rejDateStr = record.rejectionDate.toISOString().split('T')[0];
        if (trends[rejDateStr]) {
          trends[rejDateStr].rejected += 1;
        }
      }
    });

    return Object.values(trends);
  }

  /**
   * Get rejection reasons statistics
   */
  static getRejectionReasons(): { reason: string; count: number }[] {
    const records = this.getAllRecords().filter(r => r.status === 'rejected' && r.rejectionReason);
    const reasons: { [key: string]: number } = {};

    records.forEach(record => {
      const reason = record.rejectionReason || 'Unknown';
      reasons[reason] = (reasons[reason] || 0) + 1;
    });

    return Object.entries(reasons)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get university distribution
   */
  static getUniversityDistribution(): { university: string; count: number }[] {
    const records = this.getAllRecords();
    const distribution: { [key: string]: number } = {};

    records.forEach(record => {
      distribution[record.universityName] = (distribution[record.universityName] || 0) + 1;
    });

    return Object.entries(distribution)
      .map(([university, count]) => ({ university, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10
  }

  /**
   * Approve university registration
   */
  static approveRegistration(recordId: string, adminCredentials: string): boolean {
    const record = this.getRecordById(recordId);
    if (!record) return false;

    record.status = 'approved';
    record.approvalDate = new Date();
    if (record.emailVerifiedDate) {
      record.approvalTimeHours = (record.approvalDate.getTime() - record.emailVerifiedDate.getTime()) / (1000 * 60 * 60);
    }

    this.updateRecord(record);
    return true;
  }

  /**
   * Reject university registration
   */
  static rejectRegistration(recordId: string, reason: string): boolean {
    const record = this.getRecordById(recordId);
    if (!record) return false;

    record.status = 'rejected';
    record.rejectionDate = new Date();
    record.rejectionReason = reason;

    this.updateRecord(record);
    return true;
  }

  /**
   * Mark email as verified
   */
  static markEmailVerified(recordId: string): boolean {
    const record = this.getRecordById(recordId);
    if (!record) return false;

    record.status = 'email-verified';
    record.emailVerifiedDate = new Date();
    record.verificationTimeMinutes = (record.emailVerifiedDate.getTime() - record.registrationDate.getTime()) / (1000 * 60);

    this.updateRecord(record);
    return true;
  }

  /**
   * Clear all records (for testing)
   */
  static clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Generate sample data for demo
   */
  static generateSampleData(): void {
    const universities = [
      'Indian Institute of Technology Delhi',
      'Indian Institute of Technology Bombay',
      'Delhi University',
      'University of Mumbai',
      'Jawaharlal Nehru University',
      'Anna University',
      'Banaras Hindu University',
    ];

    const statuses: VerificationRecord['status'][] = ['pending', 'email-verified', 'approved', 'rejected'];
    const rejectionReasons = [
      'Invalid university domain',
      'Incomplete information',
      'Domain verification failed',
      'Duplicate registration',
    ];

    // Generate 50 sample records
    for (let i = 0; i < 50; i++) {
      const now = new Date();
      const registrationDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const record: VerificationRecord = {
        id: `rec_${Date.now()}_${i}`,
        universityName: universities[Math.floor(Math.random() * universities.length)],
        universityId: `uni_${i}`,
        adminEmail: `admin${i}@university.edu`,
        adminName: `Admin ${i}`,
        registrationDate,
        status,
        otpAttempts: Math.floor(Math.random() * 5),
      };

      if (status !== 'pending') {
        record.emailVerifiedDate = new Date(registrationDate.getTime() + Math.random() * 24 * 60 * 60 * 1000);
        record.verificationTimeMinutes = (record.emailVerifiedDate.getTime() - registrationDate.getTime()) / (1000 * 60);
      }

      if (status === 'approved') {
        record.approvalDate = new Date(record.emailVerifiedDate!.getTime() + Math.random() * 72 * 60 * 60 * 1000);
        record.approvalTimeHours = (record.approvalDate.getTime() - record.emailVerifiedDate!.getTime()) / (1000 * 60 * 60);
      } else if (status === 'rejected') {
        record.rejectionDate = new Date(record.emailVerifiedDate!.getTime() + Math.random() * 48 * 60 * 60 * 1000);
        record.rejectionReason = rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)];
      }

      this.storeRecord(record);
    }
  }
}
