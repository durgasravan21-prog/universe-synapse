import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Clock, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import {
  OTPManager,
  verifyOTP,
  getOTPTimeRemaining,
  formatTimeRemaining,
  type OTPRecord,
} from '@/data/otpSystem';

interface OTPVerificationProps {
  email: string;
  universityName: string;
  onVerificationSuccess: (otpRecord: OTPRecord) => void;
  onCancel: () => void;
  otpRecord: OTPRecord;
}

/**
 * OTP Verification Component
 * Handles OTP input and verification with countdown timer
 */
export default function OTPVerification({
  email,
  universityName,
  onVerificationSuccess,
  onCancel,
  otpRecord,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getOTPTimeRemaining(otpRecord);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        setIsExpired(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [otpRecord]);

  // Focus on first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle OTP input change
  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);

    if (digits.length > 0) {
      const newOtp = digits.split('').concat(Array(6 - digits.length).fill(''));
      setOtp(newOtp as string[]);

      // Focus on the last filled input
      const focusIndex = Math.min(digits.length, 5);
      setTimeout(() => {
        inputRefs.current[focusIndex]?.focus();
      }, 0);
    }
  };

  // Verify OTP
  const handleVerify = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits of the OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result = verifyOTP(otpRecord, otpCode);

      if (result.success) {
        setSuccess('Email verified successfully!');
        OTPManager.updateOTP(otpRecord);
        
        // Show success message briefly before calling callback
        setTimeout(() => {
          onVerificationSuccess(otpRecord);
        }, 1500);
      } else {
        setError(result.message || 'Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('An error occurred during verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Request new OTP
  const handleRequestNewOTP = () => {
    OTPManager.deleteOTP(email);
    onCancel();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Verify Your Email</h1>
          <p className="text-slate-600">
            We've sent a verification code to<br />
            <span className="font-semibold text-slate-900">{email}</span>
          </p>
          <p className="text-sm text-slate-500 mt-2">For: <span className="font-semibold">{universityName}</span></p>
        </div>

        {/* Timer */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className={`w-5 h-5 ${isExpired ? 'text-red-600' : 'text-blue-600'}`} />
              <span className={`font-semibold ${isExpired ? 'text-red-600' : 'text-blue-600'}`}>
                {isExpired ? 'Code Expired' : `Code expires in ${formatTimeRemaining(timeRemaining)}`}
              </span>
            </div>
          </div>
          {isExpired && (
            <p className="text-sm text-red-600 mt-2">
              Your verification code has expired. Please request a new one.
            </p>
          )}
        </div>

        {/* OTP Input */}
        {!isExpired && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-4">
                Enter 6-Digit Code
              </label>
              <div className="flex gap-3 justify-between">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={loading}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                You can also paste the code directly
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed mb-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Verify Email
                </>
              )}
            </Button>
          </>
        )}

        {/* Expired State */}
        {isExpired && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 text-center">
              Your verification code has expired. Please request a new one to continue.
            </p>
          </div>
        )}

        {/* Request New OTP Button */}
        <Button
          onClick={handleRequestNewOTP}
          variant="outline"
          className="w-full mb-4"
        >
          {isExpired ? 'Request New Code' : 'Didn\'t receive the code?'}
        </Button>

        {/* Cancel Button */}
        <Button
          onClick={onCancel}
          variant="outline"
          className="w-full text-slate-600"
        >
          Cancel
        </Button>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-600 text-center mb-2">
            <strong>Security Tip:</strong> Never share your verification code with anyone. UniVerse Synapse staff will never ask for it.
          </p>
        </div>

        {/* Support */}
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            Having trouble? <a href="mailto:support@synapse.in" className="text-blue-600 hover:text-blue-700 font-semibold">Contact Support</a>
          </p>
        </div>
      </Card>

      {/* Contact Details Card */}
      <Card className="w-full max-w-md p-6 shadow-lg mt-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
        <h3 className="font-bold text-slate-900 mb-4 text-center">Need Help?</h3>
        
        <div className="space-y-4">
          {/* Email Support */}
          <div className="flex gap-3">
            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Email Support</p>
              <a href="mailto:support@synapse.in" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                support@synapse.in
              </a>
            </div>
          </div>

          {/* Phone Support */}
          <div className="flex gap-3">
            <div className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 flex items-center justify-center">
              <span className="text-lg">📞</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Phone Support</p>
              <a href="tel:+919876543210" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                +91 9876 543 210
              </a>
            </div>
          </div>

          {/* Live Chat */}
          <div className="flex gap-3">
            <div className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 flex items-center justify-center">
              <span className="text-lg">💬</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Live Chat</p>
              <p className="text-sm text-slate-600">Available Mon-Fri, 9 AM - 6 PM IST</p>
            </div>
          </div>

          {/* Help Center */}
          <div className="flex gap-3">
            <div className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 flex items-center justify-center">
              <span className="text-lg">❓</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Help Center</p>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                Visit our FAQ & Documentation
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-blue-200">
          <p className="text-xs text-slate-600 text-center">
            <strong>Response Time:</strong> We typically respond within 2 hours during business hours.
          </p>
        </div>
      </Card>
    </div>
  );
}
