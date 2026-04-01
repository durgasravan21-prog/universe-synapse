/**
 * Email Notification Service
 * Handles automated email notifications for registration status changes
 */

export type EmailNotificationType =
  | 'registration-submitted'
  | 'email-verified'
  | 'under-review'
  | 'approved'
  | 'rejected'
  | 'otp-sent'
  | 'otp-expired'
  | 'approval-reminder';

export interface EmailNotification {
  id: string;
  registrationId: string;
  email: string;
  type: EmailNotificationType;
  subject: string;
  htmlContent: string;
  plainTextContent: string;
  sentAt: Date;
  deliveryStatus: 'pending' | 'sent' | 'failed' | 'bounced';
  deliveryAttempts: number;
  lastAttemptAt?: Date;
  errorMessage?: string;
}

export interface EmailNotificationLog {
  registrationId: string;
  notifications: EmailNotification[];
}

/**
 * Email Notification Service
 */
export class EmailNotificationService {
  private static readonly STORAGE_KEY = 'synapse_email_notifications';
  private static readonly MAX_RETRY_ATTEMPTS = 3;
  private static readonly RETRY_DELAY_MS = 5000;

  /**
   * Send email notification
   */
  static async sendEmailNotification(
    registrationId: string,
    email: string,
    type: EmailNotificationType,
    subject: string,
    htmlContent: string,
    plainTextContent: string
  ): Promise<EmailNotification> {
    const notification: EmailNotification = {
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      registrationId,
      email,
      type,
      subject,
      htmlContent,
      plainTextContent,
      sentAt: new Date(),
      deliveryStatus: 'pending',
      deliveryAttempts: 0,
    };

    // Store notification
    this.storeNotification(notification);

    // Simulate sending email (in production, integrate with SendGrid/AWS SES)
    try {
      await this.simulateSendEmail(notification);
      notification.deliveryStatus = 'sent';
      notification.deliveryAttempts = 1;
      notification.lastAttemptAt = new Date();
    } catch (error) {
      notification.deliveryStatus = 'failed';
      notification.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      notification.deliveryAttempts = 1;
      notification.lastAttemptAt = new Date();
    }

    // Update notification
    this.updateNotification(notification);

    return notification;
  }

  /**
   * Simulate sending email (for development)
   */
  private static async simulateSendEmail(notification: EmailNotification): Promise<void> {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        console.log(`📧 Email sent to ${notification.email}`);
        console.log(`Subject: ${notification.subject}`);
        console.log(`Type: ${notification.type}`);
        resolve();
      }, 1000);
    });
  }

  /**
   * Store notification
   */
  private static storeNotification(notification: EmailNotification): void {
    const notifications = this.getAllNotifications();
    notifications.push(notification);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
  }

  /**
   * Update notification
   */
  private static updateNotification(notification: EmailNotification): void {
    const notifications = this.getAllNotifications();
    const index = notifications.findIndex(n => n.id === notification.id);
    if (index !== -1) {
      notifications[index] = notification;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
    }
  }

  /**
   * Get all notifications
   */
  static getAllNotifications(): EmailNotification[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    try {
      const notifications = JSON.parse(data);
      return notifications.map((n: any) => ({
        ...n,
        sentAt: new Date(n.sentAt),
        lastAttemptAt: n.lastAttemptAt ? new Date(n.lastAttemptAt) : undefined,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Get notifications for registration
   */
  static getNotificationsForRegistration(registrationId: string): EmailNotification[] {
    return this.getAllNotifications().filter(n => n.registrationId === registrationId);
  }

  /**
   * Get notifications for email
   */
  static getNotificationsForEmail(email: string): EmailNotification[] {
    return this.getAllNotifications().filter(n => n.email === email);
  }

  /**
   * Get sent notifications
   */
  static getSentNotifications(): EmailNotification[] {
    return this.getAllNotifications().filter(n => n.deliveryStatus === 'sent');
  }

  /**
   * Get failed notifications
   */
  static getFailedNotifications(): EmailNotification[] {
    return this.getAllNotifications().filter(n => n.deliveryStatus === 'failed');
  }

  /**
   * Retry failed notifications
   */
  static async retryFailedNotifications(): Promise<void> {
    const failed = this.getFailedNotifications();
    for (const notification of failed) {
      if (notification.deliveryAttempts < this.MAX_RETRY_ATTEMPTS) {
        try {
          await this.simulateSendEmail(notification);
          notification.deliveryStatus = 'sent';
          notification.deliveryAttempts += 1;
          notification.lastAttemptAt = new Date();
        } catch (error) {
          notification.deliveryAttempts += 1;
          notification.lastAttemptAt = new Date();
          notification.errorMessage = error instanceof Error ? error.message : 'Unknown error';
        }
        this.updateNotification(notification);
      }
    }
  }

  /**
   * Clear old notifications (older than 90 days)
   */
  static clearOldNotifications(): void {
    const notifications = this.getAllNotifications();
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const filtered = notifications.filter(n => new Date(n.sentAt) > ninetyDaysAgo);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  /**
   * Get notification statistics
   */
  static getStatistics() {
    const notifications = this.getAllNotifications();
    return {
      total: notifications.length,
      sent: notifications.filter(n => n.deliveryStatus === 'sent').length,
      failed: notifications.filter(n => n.deliveryStatus === 'failed').length,
      pending: notifications.filter(n => n.deliveryStatus === 'pending').length,
      bounced: notifications.filter(n => n.deliveryStatus === 'bounced').length,
    };
  }
}

/**
 * Email notification templates
 */
export const EmailNotificationTemplates = {
  registrationSubmitted: (universityName: string, registrationId: string) => ({
    subject: `Registration Submitted - ${universityName}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0369a1 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Registration Submitted</h1>
        </div>
        <div style="padding: 40px; background: #f8fafc; border: 1px solid #e2e8f0;">
          <p style="font-size: 16px; color: #1e293b; margin-bottom: 20px;">
            Dear Administrator,
          </p>
          <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
            Thank you for registering <strong>${universityName}</strong> with UniVerse Synapse. Your registration has been successfully submitted and is now under review.
          </p>
          <div style="background: white; padding: 20px; border-left: 4px solid #0369a1; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">
              <strong>Registration ID:</strong> ${registrationId}
            </p>
          </div>
          <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
            Our team will review your application within 2-3 business days. You can track the status of your registration at any time by visiting your status dashboard.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://synapse.in/status/${registrationId}" style="background: #0369a1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Track Your Status
            </a>
          </div>
          <p style="font-size: 14px; color: #64748b; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            If you have any questions, please contact our support team at <a href="mailto:support@synapse.in" style="color: #0369a1; text-decoration: none;">support@synapse.in</a> or call +91 9876 543 210.
          </p>
        </div>
        <div style="background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">UniVerse Synapse - Multi-Tenant University Management Platform</p>
          <p style="margin: 5px 0 0 0;">© 2026 UniVerse Synapse. All rights reserved.</p>
        </div>
      </div>
    `,
    plainTextContent: `
Registration Submitted - ${universityName}

Dear Administrator,

Thank you for registering ${universityName} with UniVerse Synapse. Your registration has been successfully submitted and is now under review.

Registration ID: ${registrationId}

Our team will review your application within 2-3 business days. You can track the status of your registration at any time by visiting your status dashboard.

Track Your Status: https://synapse.in/status/${registrationId}

If you have any questions, please contact our support team at support@synapse.in or call +91 9876 543 210.

---
UniVerse Synapse - Multi-Tenant University Management Platform
© 2026 UniVerse Synapse. All rights reserved.
    `,
  }),

  emailVerified: (universityName: string, email: string) => ({
    subject: `Email Verified - ${universityName}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">✓ Email Verified</h1>
        </div>
        <div style="padding: 40px; background: #f8fafc; border: 1px solid #e2e8f0;">
          <p style="font-size: 16px; color: #1e293b; margin-bottom: 20px;">
            Dear Administrator,
          </p>
          <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
            Congratulations! Your email address <strong>${email}</strong> has been successfully verified for ${universityName}.
          </p>
          <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
            Your registration is now progressing to the next stage of review. Our team will conduct a thorough verification of your university details.
          </p>
          <div style="background: #ecfdf5; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #065f46;">
              ✓ Email domain verified<br>
              ⏳ Under review by admin team<br>
              📧 You'll receive updates via email
            </p>
          </div>
          <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
            Thank you for your patience. We'll notify you as soon as your registration is approved.
          </p>
          <p style="font-size: 14px; color: #64748b; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            If you have any questions, please contact our support team at <a href="mailto:support@synapse.in" style="color: #0369a1; text-decoration: none;">support@synapse.in</a>.
          </p>
        </div>
        <div style="background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">UniVerse Synapse - Multi-Tenant University Management Platform</p>
        </div>
      </div>
    `,
    plainTextContent: `
Email Verified - ${universityName}

Dear Administrator,

Congratulations! Your email address ${email} has been successfully verified for ${universityName}.

Your registration is now progressing to the next stage of review. Our team will conduct a thorough verification of your university details.

✓ Email domain verified
⏳ Under review by admin team
📧 You'll receive updates via email

Thank you for your patience. We'll notify you as soon as your registration is approved.

If you have any questions, please contact our support team at support@synapse.in.

---
UniVerse Synapse - Multi-Tenant University Management Platform
    `,
  }),

  underReview: (universityName: string) => ({
    subject: `Registration Under Review - ${universityName}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">⏳ Under Review</h1>
        </div>
        <div style="padding: 40px; background: #f8fafc; border: 1px solid #e2e8f0;">
          <p style="font-size: 16px; color: #1e293b; margin-bottom: 20px;">
            Dear Administrator,
          </p>
          <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
            Your registration for <strong>${universityName}</strong> is now under review by our verification team.
          </p>
          <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
            We are conducting a comprehensive verification of your university details to ensure compliance with our standards. This process typically takes 2-3 business days.
          </p>
          <div style="background: #fffbeb; padding: 20px; border-left: 4px solid #fbbf24; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #78350f;">
              <strong>What's happening:</strong><br>
              • Verifying university credentials<br>
              • Checking domain authenticity<br>
              • Validating administrative details<br>
              • Final approval process
            </p>
          </div>
          <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
            You will receive an email notification as soon as your registration is approved or if we need additional information.
          </p>
          <p style="font-size: 14px; color: #64748b; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            Thank you for your patience. If you have any questions, please contact support@synapse.in.
          </p>
        </div>
        <div style="background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">UniVerse Synapse - Multi-Tenant University Management Platform</p>
        </div>
      </div>
    `,
    plainTextContent: `
Registration Under Review - ${universityName}

Dear Administrator,

Your registration for ${universityName} is now under review by our verification team.

We are conducting a comprehensive verification of your university details to ensure compliance with our standards. This process typically takes 2-3 business days.

What's happening:
• Verifying university credentials
• Checking domain authenticity
• Validating administrative details
• Final approval process

You will receive an email notification as soon as your registration is approved or if we need additional information.

Thank you for your patience. If you have any questions, please contact support@synapse.in.

---
UniVerse Synapse - Multi-Tenant University Management Platform
    `,
  }),

  approved: (universityName: string, adminEmail: string, adminPassword: string) => ({
    subject: `🎉 Registration Approved - ${universityName}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Registration Approved!</h1>
        </div>
        <div style="padding: 40px; background: #f8fafc; border: 1px solid #e2e8f0;">
          <p style="font-size: 16px; color: #1e293b; margin-bottom: 20px;">
            Dear Administrator,
          </p>
          <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
            Congratulations! Your registration for <strong>${universityName}</strong> has been approved. You can now access the UniVerse Synapse platform.
          </p>
          <div style="background: #ecfdf5; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #065f46;">
              <strong>Your Admin Credentials:</strong><br>
              Email: <strong>${adminEmail}</strong><br>
              <em>Password: Check your secure password manager</em>
            </p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://synapse.in/signin" style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Log In Now
            </a>
          </div>
          <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
            <strong>Next Steps:</strong>
          </p>
          <ol style="font-size: 15px; color: #475569; line-height: 1.8;">
            <li>Log in with your admin credentials</li>
            <li>Complete your university profile setup</li>
            <li>Create departments and manage staff</li>
            <li>Invite students and begin operations</li>
          </ol>
          <p style="font-size: 14px; color: #64748b; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            Welcome to UniVerse Synapse! If you need any assistance, our support team is available at <a href="mailto:support@synapse.in" style="color: #0369a1; text-decoration: none;">support@synapse.in</a>.
          </p>
        </div>
        <div style="background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">UniVerse Synapse - Multi-Tenant University Management Platform</p>
          <p style="margin: 5px 0 0 0;">© 2026 UniVerse Synapse. All rights reserved.</p>
        </div>
      </div>
    `,
    plainTextContent: `
🎉 Registration Approved - ${universityName}

Dear Administrator,

Congratulations! Your registration for ${universityName} has been approved. You can now access the UniVerse Synapse platform.

Your Admin Credentials:
Email: ${adminEmail}
Password: Check your secure password manager

Log In Now: https://synapse.in/signin

Next Steps:
1. Log in with your admin credentials
2. Complete your university profile setup
3. Create departments and manage staff
4. Invite students and begin operations

Welcome to UniVerse Synapse! If you need any assistance, our support team is available at support@synapse.in.

---
UniVerse Synapse - Multi-Tenant University Management Platform
© 2026 UniVerse Synapse. All rights reserved.
    `,
  }),

  rejected: (universityName: string, reason?: string) => ({
    subject: `Registration Update - ${universityName}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Registration Update</h1>
        </div>
        <div style="padding: 40px; background: #f8fafc; border: 1px solid #e2e8f0;">
          <p style="font-size: 16px; color: #1e293b; margin-bottom: 20px;">
            Dear Administrator,
          </p>
          <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
            Thank you for your interest in UniVerse Synapse. Unfortunately, your registration for <strong>${universityName}</strong> could not be approved at this time.
          </p>
          ${reason ? `
          <div style="background: #fee2e2; padding: 20px; border-left: 4px solid #ef4444; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #7f1d1d;">
              <strong>Reason:</strong><br>
              ${reason}
            </p>
          </div>
          ` : ''}
          <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
            We encourage you to review the requirements and resubmit your application. Our team is here to help you through the process.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:support@synapse.in" style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Contact Support
            </a>
          </div>
          <p style="font-size: 14px; color: #64748b; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            Our support team can provide guidance on addressing any issues. Please reach out at <a href="mailto:support@synapse.in" style="color: #0369a1; text-decoration: none;">support@synapse.in</a> or call +91 9876 543 210.
          </p>
        </div>
        <div style="background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">UniVerse Synapse - Multi-Tenant University Management Platform</p>
        </div>
      </div>
    `,
    plainTextContent: `
Registration Update - ${universityName}

Dear Administrator,

Thank you for your interest in UniVerse Synapse. Unfortunately, your registration for ${universityName} could not be approved at this time.

${reason ? `Reason:\n${reason}\n\n` : ''}

We encourage you to review the requirements and resubmit your application. Our team is here to help you through the process.

Contact Support: support@synapse.in

Our support team can provide guidance on addressing any issues. Please reach out at support@synapse.in or call +91 9876 543 210.

---
UniVerse Synapse - Multi-Tenant University Management Platform
    `,
  }),
};
