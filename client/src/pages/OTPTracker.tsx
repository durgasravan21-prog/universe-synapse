import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Copy, Trash2, RefreshCw, Clock } from 'lucide-react';
import { OTPManager, formatTimeRemaining, getOTPTimeRemaining, type OTPRecord } from '@/data/otpSystem';

/**
 * OTP Tracker Component
 * For development/testing: Shows all OTP records and their status
 */
export default function OTPTracker() {
  const [otpRecords, setOtpRecords] = useState<OTPRecord[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load OTP records
  useEffect(() => {
    const loadRecords = () => {
      OTPManager.cleanupExpiredOTPs();
      const records = OTPManager.getAllOTPs();
      setOtpRecords(records);
    };

    loadRecords();
    const interval = setInterval(loadRecords, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleCopyOTP = (otp: string, id: string) => {
    navigator.clipboard.writeText(otp);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteOTP = (email: string) => {
    OTPManager.deleteOTP(email);
    setOtpRecords(prev => prev.filter(r => r.email !== email));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all OTP records?')) {
      OTPManager.clearAll();
      setOtpRecords([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">OTP Tracker</h1>
          <p className="text-slate-600">Development tool: Monitor and manage OTP verification codes</p>
        </div>

        {/* Info Card */}
        <Card className="mb-6 p-6 bg-blue-50 border-blue-200">
          <div className="flex gap-4">
            <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">How OTP Verification Works</h3>
              <ol className="text-sm text-slate-700 space-y-1 list-decimal list-inside">
                <li>University admin enters their official email during registration</li>
                <li>System generates a 6-digit OTP code</li>
                <li>OTP is sent via email (simulated in development)</li>
                <li>Admin enters the OTP within 15 minutes to verify email</li>
                <li>After verification, account goes to admin approval workflow</li>
              </ol>
            </div>
          </div>
        </Card>

        {/* Controls */}
        <div className="mb-6 flex gap-3">
          <Button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            onClick={handleClearAll}
            variant="outline"
            className="text-red-600 hover:text-red-700"
          >
            Clear All
          </Button>
        </div>

        {/* OTP Records */}
        {otpRecords.length > 0 ? (
          <div className="space-y-4">
            {otpRecords.map(record => {
              const timeRemaining = getOTPTimeRemaining(record);
              const isExpired = timeRemaining <= 0;
              const isVerified = record.verified;

              return (
                <Card key={record.id} className="p-6 border-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    {/* Left Column */}
                    <div>
                      <div className="mb-4">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
                        <p className="text-lg font-semibold text-slate-900">{record.email}</p>
                      </div>
                      <div className="mb-4">
                        <label className="text-xs font-semibold text-slate-500 uppercase">University</label>
                        <p className="text-sm text-slate-700">{record.universityName || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase">Created</label>
                        <p className="text-sm text-slate-700">
                          {record.createdAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                        </p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div>
                      {/* OTP Code */}
                      <div className="mb-4 p-4 bg-slate-100 rounded-lg border-2 border-slate-200">
                        <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">
                          OTP Code
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-bold text-blue-600 font-mono tracking-widest">
                            {record.otp}
                          </span>
                          <button
                            onClick={() => handleCopyOTP(record.otp, record.id)}
                            className="p-2 hover:bg-slate-200 rounded transition-colors"
                            title="Copy OTP"
                          >
                            <Copy className={`w-4 h-4 ${copiedId === record.id ? 'text-green-600' : 'text-slate-600'}`} />
                          </button>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex gap-4">
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                isVerified
                                  ? 'bg-green-100 text-green-700'
                                  : isExpired
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {isVerified ? '✓ Verified' : isExpired ? '✗ Expired' : '⏳ Pending'}
                            </span>
                          </div>
                        </div>

                        {/* Time Remaining */}
                        {!isVerified && !isExpired && (
                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Expires In</label>
                            <div className="flex items-center gap-1 mt-1 text-blue-600 font-semibold">
                              <Clock className="w-4 h-4" />
                              {formatTimeRemaining(timeRemaining)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Attempts */}
                  <div className="mb-4 p-3 bg-slate-50 rounded">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Verification Attempts</label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            record.attempts >= record.maxAttempts ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                          style={{
                            width: `${(record.attempts / record.maxAttempts) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        {record.attempts}/{record.maxAttempts}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteOTP(record.email)}
                      className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No OTP records yet</p>
            <p className="text-slate-400 text-sm mt-2">
              OTP codes will appear here when users register and request email verification
            </p>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-8 p-4 bg-slate-100 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-600">
            <strong>Note:</strong> This is a development tool for testing OTP verification. In production, OTPs are sent via email service (SendGrid, AWS SES, etc.) and this page would not be accessible.
          </p>
        </div>
      </div>
    </div>
  );
}
