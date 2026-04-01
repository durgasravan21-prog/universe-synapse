import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Download,
  RefreshCw,
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { EmailNotificationService, type EmailNotification } from '@/data/emailNotificationService';

/**
 * Email Notification History Page
 * Shows all sent emails and their delivery status
 */
export default function EmailNotificationHistory() {
  const [notifications, setNotifications] = useState<EmailNotification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<EmailNotification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<EmailNotification | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'sent' | 'failed' | 'pending' | 'bounced'>('all');
  const [searchEmail, setSearchEmail] = useState('');
  const [loading, setLoading] = useState(true);

  // Load notifications
  useEffect(() => {
    const loadNotifications = () => {
      const allNotifications = EmailNotificationService.getAllNotifications();
      setNotifications(allNotifications);
      setLoading(false);
    };

    loadNotifications();
  }, []);

  // Filter notifications
  useEffect(() => {
    let filtered = notifications;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(n => n.deliveryStatus === filterStatus);
    }

    if (searchEmail) {
      filtered = filtered.filter(n => n.email.toLowerCase().includes(searchEmail.toLowerCase()));
    }

    setFilteredNotifications(filtered);
  }, [notifications, filterStatus, searchEmail]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      const allNotifications = EmailNotificationService.getAllNotifications();
      setNotifications(allNotifications);
      setLoading(false);
    }, 500);
  };

  const handleRetryFailed = async () => {
    await EmailNotificationService.retryFailedNotifications();
    handleRefresh();
  };

  const handleDeleteNotification = (id: string) => {
    EmailNotificationService.getAllNotifications();
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
  };

  const handleDownloadReport = () => {
    const stats = EmailNotificationService.getStatistics();
    const content = `
Email Notification Report
=========================

Generated: ${new Date().toLocaleString('en-IN')}

Summary Statistics:
- Total Emails: ${stats.total}
- Sent: ${stats.sent}
- Failed: ${stats.failed}
- Pending: ${stats.pending}
- Bounced: ${stats.bounced}

Delivery Rate: ${stats.total > 0 ? ((stats.sent / stats.total) * 100).toFixed(2) : 0}%

---

Detailed Notifications:
${filteredNotifications.map(n => `
Email ID: ${n.id}
To: ${n.email}
Subject: ${n.subject}
Type: ${n.type}
Status: ${n.deliveryStatus}
Sent At: ${n.sentAt.toLocaleString('en-IN')}
Attempts: ${n.deliveryAttempts}
${n.errorMessage ? `Error: ${n.errorMessage}` : ''}
`).join('\n')}
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `email-notifications-${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'bounced':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Mail className="w-5 h-5 text-slate-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-50 text-green-900 border-green-200';
      case 'failed':
        return 'bg-red-50 text-red-900 border-red-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-900 border-yellow-200';
      case 'bounced':
        return 'bg-orange-50 text-orange-900 border-orange-200';
      default:
        return 'bg-slate-50 text-slate-900 border-slate-200';
    }
  };

  const stats = EmailNotificationService.getStatistics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Email Notification History</h1>
          <p className="text-slate-600">Track all email communications and delivery status</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-6 border-2">
            <p className="text-sm font-semibold text-slate-600 uppercase mb-2">Total Emails</p>
            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
          </Card>
          <Card className="p-6 border-2 border-green-200 bg-green-50">
            <p className="text-sm font-semibold text-green-600 uppercase mb-2">Sent</p>
            <p className="text-3xl font-bold text-green-900">{stats.sent}</p>
          </Card>
          <Card className="p-6 border-2 border-yellow-200 bg-yellow-50">
            <p className="text-sm font-semibold text-yellow-600 uppercase mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
          </Card>
          <Card className="p-6 border-2 border-red-200 bg-red-50">
            <p className="text-sm font-semibold text-red-600 uppercase mb-2">Failed</p>
            <p className="text-3xl font-bold text-red-900">{stats.failed}</p>
          </Card>
          <Card className="p-6 border-2 border-orange-200 bg-orange-50">
            <p className="text-sm font-semibold text-orange-600 uppercase mb-2">Bounced</p>
            <p className="text-3xl font-bold text-orange-900">{stats.bounced}</p>
          </Card>
        </div>

        {/* Delivery Rate */}
        <Card className="p-6 mb-8 border-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Delivery Rate</h3>
            <span className="text-2xl font-bold text-blue-600">
              {stats.total > 0 ? ((stats.sent / stats.total) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
              style={{ width: `${stats.total > 0 ? (stats.sent / stats.total) * 100 : 0}%` }}
            />
          </div>
        </Card>

        {/* Filters and Actions */}
        <Card className="p-6 mb-8 border-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Search Email</label>
              <input
                type="text"
                placeholder="Enter email address..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Status */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Filter Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="sent">Sent</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="bounced">Bounced</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-end gap-2">
              <Button
                onClick={handleRefresh}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 flex-1"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button
                onClick={handleDownloadReport}
                variant="outline"
                className="flex items-center gap-2 flex-1"
              >
                <Download className="w-4 h-4" />
                Report
              </Button>
            </div>
          </div>

          {/* Retry Failed */}
          {stats.failed > 0 && (
            <Button
              onClick={handleRetryFailed}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg"
            >
              Retry {stats.failed} Failed Email(s)
            </Button>
          )}
        </Card>

        {/* Notifications List */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-semibold">Loading emails...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card className="p-12 border-2 text-center">
            <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-semibold">No emails found</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className="p-6 border-2 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setSelectedNotification(notification)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {getStatusIcon(notification.deliveryStatus)}
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 mb-1">{notification.subject}</h4>
                      <p className="text-sm text-slate-600 mb-2">To: {notification.email}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(notification.deliveryStatus)}`}>
                          {notification.deliveryStatus.charAt(0).toUpperCase() + notification.deliveryStatus.slice(1)}
                        </span>
                        <span className="text-xs text-slate-600">
                          {notification.sentAt.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-600">
                          Attempt {notification.deliveryAttempts}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNotification(notification);
                      }}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Email Preview Modal */}
        {selectedNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-96 overflow-y-auto border-2">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">{selectedNotification.subject}</h3>
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="text-slate-500 hover:text-slate-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">To:</p>
                    <p className="text-slate-900">{selectedNotification.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Status:</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedNotification.deliveryStatus)}
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${getStatusColor(selectedNotification.deliveryStatus)}`}>
                        {selectedNotification.deliveryStatus.charAt(0).toUpperCase() + selectedNotification.deliveryStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Sent At:</p>
                    <p className="text-slate-900">{selectedNotification.sentAt.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <p className="text-sm font-semibold text-slate-600 mb-3">Email Content (HTML):</p>
                  <div
                    className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-700 max-h-48 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: selectedNotification.htmlContent }}
                  />
                </div>

                <div className="mt-6 flex gap-2">
                  <Button
                    onClick={() => setSelectedNotification(null)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
