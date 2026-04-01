/**
 * Status Notification System
 * Handles real-time notifications for registration status changes
 */

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface StatusNotification {
  id: string;
  registrationId: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export class StatusNotificationManager {
  private static readonly STORAGE_KEY = 'synapse_notifications';
  private static listeners: ((notifications: StatusNotification[]) => void)[] = [];

  /**
   * Create and store a notification
   */
  static createNotification(
    registrationId: string,
    type: NotificationType,
    title: string,
    message: string,
    actionUrl?: string
  ): StatusNotification {
    const notification: StatusNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      registrationId,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      actionUrl,
    };

    this.storeNotification(notification);
    this.notifyListeners();
    return notification;
  }

  /**
   * Store notification
   */
  private static storeNotification(notification: StatusNotification): void {
    const notifications = this.getAllNotifications();
    notifications.push(notification);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
  }

  /**
   * Get all notifications
   */
  static getAllNotifications(): StatusNotification[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    try {
      const notifications = JSON.parse(data);
      return notifications.map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp),
      }));
    } catch {
      return [];
    }
  }

  /**
   * Get unread notifications
   */
  static getUnreadNotifications(): StatusNotification[] {
    return this.getAllNotifications().filter(n => !n.read);
  }

  /**
   * Get notifications for a registration
   */
  static getNotificationsForRegistration(registrationId: string): StatusNotification[] {
    return this.getAllNotifications().filter(n => n.registrationId === registrationId);
  }

  /**
   * Mark notification as read
   */
  static markAsRead(notificationId: string): void {
    const notifications = this.getAllNotifications();
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
      this.notifyListeners();
    }
  }

  /**
   * Mark all notifications as read
   */
  static markAllAsRead(): void {
    const notifications = this.getAllNotifications();
    notifications.forEach(n => (n.read = true));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
    this.notifyListeners();
  }

  /**
   * Delete notification
   */
  static deleteNotification(notificationId: string): void {
    const notifications = this.getAllNotifications().filter(n => n.id !== notificationId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
    this.notifyListeners();
  }

  /**
   * Subscribe to notification changes
   */
  static subscribe(listener: (notifications: StatusNotification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners
   */
  private static notifyListeners(): void {
    const notifications = this.getAllNotifications();
    this.listeners.forEach(listener => listener(notifications));
  }

  /**
   * Clear all notifications
   */
  static clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.notifyListeners();
  }

  /**
   * Get notification icon
   */
  static getNotificationIcon(type: NotificationType): string {
    const icons: Record<NotificationType, string> = {
      'info': 'ℹ️',
      'success': '✅',
      'warning': '⚠️',
      'error': '❌',
    };
    return icons[type];
  }

  /**
   * Get notification color
   */
  static getNotificationColor(type: NotificationType): string {
    const colors: Record<NotificationType, string> = {
      'info': 'bg-blue-50 border-blue-200 text-blue-900',
      'success': 'bg-green-50 border-green-200 text-green-900',
      'warning': 'bg-yellow-50 border-yellow-200 text-yellow-900',
      'error': 'bg-red-50 border-red-200 text-red-900',
    };
    return colors[type];
  }
}

/**
 * Pre-defined notification templates
 */
export const NotificationTemplates = {
  registrationSubmitted: (universityName: string) => ({
    type: 'success' as NotificationType,
    title: 'Registration Submitted',
    message: `Your registration for ${universityName} has been submitted successfully. We'll review it within 2-3 business days.`,
  }),

  emailVerified: (email: string) => ({
    type: 'success' as NotificationType,
    title: 'Email Verified',
    message: `Your email ${email} has been verified successfully.`,
  }),

  underReview: (universityName: string) => ({
    type: 'info' as NotificationType,
    title: 'Under Review',
    message: `Your registration for ${universityName} is now under review by our team.`,
  }),

  approved: (universityName: string) => ({
    type: 'success' as NotificationType,
    title: 'Registration Approved!',
    message: `Congratulations! Your registration for ${universityName} has been approved. You can now access the platform.`,
  }),

  rejected: (universityName: string, reason?: string) => ({
    type: 'error' as NotificationType,
    title: 'Registration Not Approved',
    message: `Your registration for ${universityName} was not approved.${reason ? ` Reason: ${reason}` : ''}`,
  }),

  otpSent: (email: string) => ({
    type: 'info' as NotificationType,
    title: 'Verification Code Sent',
    message: `A verification code has been sent to ${email}. Please check your email.`,
  }),

  otpExpired: () => ({
    type: 'warning' as NotificationType,
    title: 'Verification Code Expired',
    message: 'Your verification code has expired. Please request a new one.',
  }),

  supportResponse: (message: string) => ({
    type: 'info' as NotificationType,
    title: 'Support Response',
    message,
  }),
};
