import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Clock, AlertCircle, Mail, ArrowRight } from 'lucide-react';
import { verifyEmailToken, getDaysRemainingForApproval, getVerificationStatusText } from '@/data/verificationSystem';
import type { UniversityRegistration } from '@/data/verificationSystem';

/**
 * Verification Status Page
 * Shows real-time verification progress with email confirmation
 */
export default function VerificationStatus() {
  const [, setLocation] = useLocation();
  const [registration, setRegistration] = useState<UniversityRegistration | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    // Retrieve registration from session storage
    const stored = sessionStorage.getItem('currentRegistration');
    if (stored) {
      setRegistration(JSON.parse(stored));
    } else {
      setLocation('/');
    }
  }, [setLocation]);

  const handleVerifyEmail = async () => {
    if (!registration || !verificationCode.trim()) {
      setMessage('Please enter the verification code');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result = verifyEmailToken(registration, verificationCode);
      if (result.success && result.registration) {
        setRegistration(result.registration);
        sessionStorage.setItem('currentRegistration', JSON.stringify(result.registration));
        setMessage(result.message);
        setMessageType('success');
        setVerificationCode('');
      } else {
        setMessage(result.message);
        setMessageType('error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!registration) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const daysRemaining = getDaysRemainingForApproval(registration);
  const progressPercent = registration.emailVerified ? 50 : 25;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Registration Status</h1>
          <p className="text-slate-600">
            {registration.universityName}
          </p>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-8 p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-700">Overall Progress</span>
              <span className="text-sm font-semibold text-blue-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-teal-500 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Status Timeline */}
          <div className="space-y-4">
            {/* Step 1: Email Verification */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {registration.emailVerified ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <Clock className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-slate-900 mb-1">Step 1: Email Verification</h3>
                <p className="text-sm text-slate-600 mb-3">
                  {registration.emailVerified
                    ? '✓ Completed on ' + new Date(registration.emailVerifiedAt!).toLocaleDateString()
                    : 'Verify your official university email address'}
                </p>

                {!registration.emailVerified && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Enter Verification Code
                      </label>
                      <p className="text-xs text-slate-600 mb-3">
                        A verification code has been sent to {registration.email}
                      </p>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                          maxLength={6}
                          className="flex-grow"
                        />
                        <Button
                          onClick={handleVerifyEmail}
                          disabled={loading || !verificationCode.trim()}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {loading ? 'Verifying...' : 'Verify'}
                        </Button>
                      </div>
                    </div>
                    {message && (
                      <div className={`text-sm p-2 rounded ${
                        messageType === 'success' ? 'bg-green-50 text-green-700' :
                        messageType === 'error' ? 'bg-red-50 text-red-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {message}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Admin Approval */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {registration.approvalStatus === 'approved' ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : registration.emailVerified ? (
                  <Clock className="w-6 h-6 text-amber-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-slate-900 mb-1">Step 2: Admin Approval</h3>
                <p className="text-sm text-slate-600 mb-3">
                  {registration.approvalStatus === 'approved'
                    ? '✓ Approved on ' + new Date(registration.approvedAt!).toLocaleDateString()
                    : registration.emailVerified
                    ? `Under review (${daysRemaining} days remaining)`
                    : 'Awaiting email verification'}
                </p>

                {registration.emailVerified && registration.approvalStatus === 'pending' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-900 text-sm">
                          Your application is under review
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                          Our administrators will verify your institution's credentials and approve your access within 2-3 business days.
                        </p>
                      </div>
                    </div>
                    <div className="bg-white rounded p-3 text-sm">
                      <p className="text-slate-700 mb-2">
                        <strong>Approval Deadline:</strong> {new Date(registration.adminApprovalDeadline!).toLocaleDateString()}
                      </p>
                      <p className="text-slate-600">
                        You will receive an email notification once your application has been reviewed.
                      </p>
                    </div>
                  </div>
                )}

                {registration.approvalStatus === 'approved' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900 text-sm mb-2">
                          Registration Approved!
                        </p>
                        <div className="bg-white rounded p-3 text-sm space-y-2">
                          <p><strong>Admin Email:</strong> {registration.adminEmail}</p>
                          <p><strong>Admin ID:</strong> {registration.adminId}</p>
                          <p className="text-slate-600">
                            Your credentials have been sent to your registered email. You can now log in to your dashboard.
                          </p>
                        </div>
                        <Button
                          onClick={() => setLocation('/signin')}
                          className="mt-3 bg-green-600 hover:bg-green-700 w-full"
                        >
                          Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Information Card */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Verification Emails</h4>
              <p className="text-sm text-blue-800">
                You will receive formal verification emails at each step of the process. Please check your inbox and spam folder if you don't see our emails.
              </p>
            </div>
          </div>
        </Card>

        {/* Support Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600 mb-3">
            Need help? Contact our support team
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.href = 'mailto:support@synapse.in'}
            className="border-slate-300"
          >
            support@synapse.in
          </Button>
        </div>
      </div>
    </div>
  );
}
