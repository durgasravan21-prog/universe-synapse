import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  Download,
  RefreshCw,
  ChevronRight,
  Calendar,
  User,
  Building2,
} from 'lucide-react';
import {
  RegistrationStatusManager,
  STAGE_LABELS,
  STAGE_DESCRIPTIONS,
  STAGE_COLORS,
  STAGE_ICONS,
  type RegistrationStatus,
} from '@/data/registrationStatus';

interface RegistrationStatusDashboardProps {
  params?: { id?: string };
}

/**
 * Registration Status Dashboard
 * Shows real-time registration and approval progress
 */
export default function RegistrationStatusDashboard({
  params,
}: RegistrationStatusDashboardProps = {}) {
  const registrationId = params?.id;
  const email = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('email') || undefined;
  const [status, setStatus] = useState<RegistrationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<{ days: number; hours: number; minutes: number } | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Load status
  useEffect(() => {
    const loadStatus = () => {
      let foundStatus: RegistrationStatus | null = null;

      if (registrationId) {
        foundStatus = RegistrationStatusManager.getStatusById(registrationId);
      } else if (email) {
        foundStatus = RegistrationStatusManager.getStatusByEmail(email);
      }

      setStatus(foundStatus);
      setLoading(false);

      if (foundStatus) {
        const remaining = RegistrationStatusManager.getTimeRemaining(foundStatus.registrationId);
        setTimeRemaining(remaining);
      }
    };

    loadStatus();

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, [registrationId, email]);

  // Update time remaining
  useEffect(() => {
    if (!status) return;

    const updateTime = () => {
      const remaining = RegistrationStatusManager.getTimeRemaining(status.registrationId);
      setTimeRemaining(remaining);
    };

    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [status]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      const foundStatus = status
        ? RegistrationStatusManager.getStatusById(status.registrationId)
        : null;
      setStatus(foundStatus);
      setLoading(false);
    }, 500);
  };

  const handleDownloadCertificate = () => {
    if (!status) return;
    const content = `
Registration Status Certificate
================================

University: ${status.universityName}
Admin Email: ${status.adminEmail}
Admin Name: ${status.adminName}
Registration Date: ${status.registrationDate.toLocaleDateString()}
Current Status: ${STAGE_LABELS[status.currentStage]}
Progress: ${status.progress}%

This is to certify that the above registration is in progress.

Generated on: ${new Date().toLocaleString()}
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `registration-status-${status.registrationId}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Loading registration status...</p>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 border-2 border-red-200 bg-red-50">
            <div className="flex gap-4">
              <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-red-900 mb-2">Registration Not Found</h2>
                <p className="text-red-700">
                  We couldn't find your registration. Please check your registration ID or email address.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const stageOrder = ['submitted', 'email-verified', 'under-review', 'approved'];
  const currentStageIndex = stageOrder.indexOf(status.currentStage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Registration Status</h1>
            <p className="text-slate-600">Track your university registration progress</p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Status Overview Card */}
        <Card className="p-8 mb-8 border-2 bg-gradient-to-br from-white to-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* University Info */}
            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase mb-4">University Information</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Building2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">UNIVERSITY</p>
                    <p className="text-lg font-bold text-slate-900">{status.universityName}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <User className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">ADMIN NAME</p>
                    <p className="text-lg font-bold text-slate-900">{status.adminName}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">EMAIL</p>
                    <p className="text-sm font-mono text-slate-900">{status.adminEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Info */}
            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase mb-4">Status Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-2">CURRENT STATUS</p>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold ${STAGE_COLORS[status.currentStage]}`}>
                    <span className="text-lg">{STAGE_ICONS[status.currentStage]}</span>
                    {STAGE_LABELS[status.currentStage]}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">REGISTRATION DATE</p>
                    <p className="text-sm font-bold text-slate-900">
                      {status.registrationDate.toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-slate-700">Overall Progress</p>
              <p className="text-sm font-bold text-blue-600">{status.progress}%</p>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{ width: `${status.progress}%` }}
              />
            </div>
          </div>

          {/* Status Message */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              {RegistrationStatusManager.getStatusMessage(status.registrationId)}
            </p>
          </div>
        </Card>

        {/* Timeline */}
        <Card className="p-8 mb-8 border-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Registration Timeline</h3>

          <div className="space-y-6">
            {stageOrder.map((stage, index) => {
              const isCompleted = index <= currentStageIndex;
              const isCurrent = stage === status.currentStage;
              const event = status.events.find(e => e.stage === stage);

              return (
                <div key={stage} className="flex gap-4">
                  {/* Timeline Marker */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {STAGE_ICONS[stage as keyof typeof STAGE_ICONS]}
                    </div>
                    {index < stageOrder.length - 1 && (
                      <div
                        className={`w-1 h-12 my-2 transition-all ${
                          isCompleted ? 'bg-green-500' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </div>

                  {/* Timeline Content */}
                  <div className="flex-1 pt-1">
                    <div className={`p-4 rounded-lg border-2 transition-all ${
                      isCurrent
                        ? 'bg-blue-50 border-blue-300'
                        : isCompleted
                        ? 'bg-green-50 border-green-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-slate-900">{STAGE_LABELS[stage as keyof typeof STAGE_LABELS]}</h4>
                        {event?.completedAt && (
                          <span className="text-xs font-semibold text-slate-600">
                            {event.completedAt.toLocaleDateString('en-IN')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 mb-2">
                        {STAGE_DESCRIPTIONS[stage as keyof typeof STAGE_DESCRIPTIONS]}
                      </p>
                      {event?.details && (
                        <p className="text-xs text-slate-600 italic">{event.details}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Time Remaining */}
        {status.currentStage !== 'approved' && status.currentStage !== 'rejected' && timeRemaining && (
          <Card className="p-8 mb-8 border-2 border-yellow-200 bg-yellow-50">
            <div className="flex gap-4">
              <Clock className="w-8 h-8 text-yellow-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-yellow-900 mb-2">Estimated Completion Time</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-3 border border-yellow-200">
                    <p className="text-2xl font-bold text-yellow-600">{timeRemaining.days}</p>
                    <p className="text-xs text-slate-600 font-semibold">Days</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-yellow-200">
                    <p className="text-2xl font-bold text-yellow-600">{timeRemaining.hours}</p>
                    <p className="text-xs text-slate-600 font-semibold">Hours</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-yellow-200">
                    <p className="text-2xl font-bold text-yellow-600">{timeRemaining.minutes}</p>
                    <p className="text-xs text-slate-600 font-semibold">Minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Approval Message */}
        {status.currentStage === 'approved' && (
          <Card className="p-8 mb-8 border-2 border-green-300 bg-green-50">
            <div className="flex gap-4">
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-green-900 mb-2">Registration Approved!</h3>
                <p className="text-green-800 mb-4">
                  Your registration has been approved. You can now access the platform with your admin credentials.
                </p>
                <p className="text-sm text-green-700">
                  <strong>Approval Date:</strong> {status.approvalDate?.toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Rejection Message */}
        {status.currentStage === 'rejected' && (
          <Card className="p-8 mb-8 border-2 border-red-300 bg-red-50">
            <div className="flex gap-4">
              <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-900 mb-2">Registration Not Approved</h3>
                <p className="text-red-800 mb-4">
                  Unfortunately, your registration was not approved.
                </p>
                {status.rejectionReason && (
                  <p className="text-sm text-red-700 mb-4">
                    <strong>Reason:</strong> {status.rejectionReason}
                  </p>
                )}
                <p className="text-sm text-red-700 mb-4">
                  Please contact our support team for more information.
                </p>
                <a
                  href="mailto:support@synapse.in"
                  className="inline-flex items-center gap-2 text-red-700 hover:text-red-900 font-semibold"
                >
                  <Mail className="w-4 h-4" />
                  Contact Support
                </a>
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={handleDownloadCertificate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Download Status Report
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </Button>
        </div>

        {/* Registration ID */}
        <div className="mt-8 p-4 bg-slate-100 rounded-lg border border-slate-300">
          <p className="text-xs text-slate-600 font-semibold mb-1">REGISTRATION ID</p>
          <p className="text-sm font-mono text-slate-900">{status.registrationId}</p>
        </div>
      </div>
    </div>
  );
}
