import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle, Loader, Mail } from 'lucide-react';
import { verifyUniversityDomain, findUniversityByName, VERIFIED_UNIVERSITIES } from '@/data/universities';
import { OTPManager, createOTPRecord, simulateSendOTPEmail, type OTPRecord } from '@/data/otpSystem';
import { getOTPVerificationEmail } from '@/data/otpEmailTemplates';
import { RegistrationStatusManager } from '@/data/registrationStatus';
import { StatusNotificationManager, NotificationTemplates } from '@/data/statusNotifications';
import OTPVerification from './OTPVerification';

type SignUpStep = 'university-selection' | 'email-verification' | 'otp-verification' | 'account-setup' | 'pending-approval';

export default function SignUpVerified() {
  const { registerUniversity } = useAuth();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<SignUpStep>('university-selection');
  const [selectedUniversity, setSelectedUniversity] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    adminName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [otpRecord, setOtpRecord] = useState<OTPRecord | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  // Filter universities based on search
  const filteredUniversities = VERIFIED_UNIVERSITIES.filter(uni =>
    uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    uni.officialDomains.some(d => d.includes(searchQuery.toLowerCase()))
  );

  const handleUniversitySelect = (university: any) => {
    setSelectedUniversity(university);
    setError('');
    setCurrentStep('email-verification');
  };

  const handleEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Verify email domain matches university
      const verifiedUni = verifyUniversityDomain(formData.email);

      if (!verifiedUni || verifiedUni.id !== selectedUniversity.id) {
        setError(
          `Email must be from an official ${selectedUniversity.name} domain (${selectedUniversity.officialDomains.join(', ')})`
        );
        setLoading(false);
        return;
      }

      // Create OTP record
      const newOtpRecord = createOTPRecord(
        formData.email,
        selectedUniversity.id,
        selectedUniversity.name
      );

      // Store OTP
      OTPManager.storeOTP(newOtpRecord);
      setOtpRecord(newOtpRecord);

      // Send OTP email
      const emailTemplate = getOTPVerificationEmail(
        selectedUniversity.name,
        formData.adminName,
        formData.email,
        newOtpRecord.otp,
        15
      );

      console.log('📧 Email Template:', emailTemplate.subject);
      console.log('📧 OTP Code:', newOtpRecord.otp);

      // Simulate sending email
      await simulateSendOTPEmail(
        formData.email,
        newOtpRecord.otp,
        selectedUniversity.name
      );

      setEmailSent(true);
      setVerificationResult({
        verified: false,
        university: verifiedUni,
        email: formData.email,
      });

      setCurrentStep('otp-verification');
    } catch (err) {
      setError('Email verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerificationSuccess = async (verifiedOtpRecord: OTPRecord) => {
    setOtpRecord(verifiedOtpRecord);
    setVerificationResult({
      ...verificationResult,
      verified: true,
      otpVerified: true,
    });
    setCurrentStep('account-setup');
  };

  const handleAccountSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.adminName.trim()) {
      setError('Admin name is required');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Register university
      await registerUniversity(
        selectedUniversity.name,
        selectedUniversity.officialDomains[0],
        formData.email
      );

      // Create registration status
      const regId = RegistrationStatusManager.createRegistrationStatus(
        selectedUniversity.name,
        selectedUniversity.id,
        formData.email,
        formData.adminName
      ).registrationId;

      setRegistrationId(regId);

      // Create notification
      StatusNotificationManager.createNotification(
        regId,
        'success',
        NotificationTemplates.registrationSubmitted(selectedUniversity.name).title,
        NotificationTemplates.registrationSubmitted(selectedUniversity.name).message
      );

      setCurrentStep('pending-approval');
    } catch (err) {
      setError('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleBack = () => {
    if (currentStep === 'email-verification') {
      setCurrentStep('university-selection');
      setSelectedUniversity(null);
      setFormData(prev => ({ ...prev, email: '' }));
    } else if (currentStep === 'otp-verification') {
      setCurrentStep('email-verification');
      setEmailSent(false);
      setOtpRecord(null);
    } else if (currentStep === 'account-setup') {
      setCurrentStep('otp-verification');
    }
  };

  // OTP Verification Step
  if (currentStep === 'otp-verification' && otpRecord) {
    return (
      <OTPVerification
        email={formData.email}
        universityName={selectedUniversity.name}
        onVerificationSuccess={handleOTPVerificationSuccess}
        onCancel={handleBack}
        otpRecord={otpRecord}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Indicator */}
        {currentStep !== 'pending-approval' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center gap-2 ${currentStep === 'university-selection' ? 'text-blue-600' : 'text-slate-400'}`}>
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</div>
                <span className="text-sm font-semibold">University</span>
              </div>
              <div className={`flex items-center gap-2 ${['email-verification', 'otp-verification', 'account-setup'].includes(currentStep) ? 'text-blue-600' : 'text-slate-400'}`}>
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</div>
                <span className="text-sm font-semibold">Verify Email</span>
              </div>
              <div className={`flex items-center gap-2 ${currentStep === 'account-setup' ? 'text-blue-600' : 'text-slate-400'}`}>
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">3</div>
                <span className="text-sm font-semibold">Setup</span>
              </div>
            </div>
            <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{
                  width: currentStep === 'university-selection' ? '33%' : currentStep === 'account-setup' ? '100%' : '66%',
                }}
              />
            </div>
          </div>
        )}

        {/* Step 1: University Selection */}
        {currentStep === 'university-selection' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Register Your University</h1>
            <p className="text-slate-600 mb-6">Select your institution from our verified list</p>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search universities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 mb-6">
              {filteredUniversities.length > 0 ? (
                filteredUniversities.map(uni => (
                  <button
                    key={uni.id}
                    onClick={() => handleUniversitySelect(uni)}
                    className="w-full text-left p-4 border-2 border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all group"
                  >
                    <div className="font-semibold text-slate-900 group-hover:text-blue-600">{uni.name}</div>
                    <div className="text-sm text-slate-500 mt-1">{uni.officialDomains.join(', ')}</div>
                    {uni.nirf_rank && (
                      <div className="text-xs text-slate-400 mt-2">NIRF Rank: {uni.nirf_rank}</div>
                    )}
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  No universities found. Try a different search.
                </div>
              )}
            </div>

            <button
              onClick={() => setLocation('/signin')}
              className="w-full text-slate-600 hover:text-slate-900 font-semibold py-2"
            >
              Already have an account? Sign In
            </button>
          </div>
        )}

        {/* Step 2: Email Verification */}
        {currentStep === 'email-verification' && selectedUniversity && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">Verify Your Email</h1>
            <p className="text-slate-600 mb-6">
              Enter your official {selectedUniversity.name} email address
            </p>

            <form onSubmit={handleEmailVerification} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Admin Name
                </label>
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Official Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={`admin@${selectedUniversity.officialDomains[0]}`}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Must be from: {selectedUniversity.officialDomains.join(', ')}
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !formData.email || !formData.adminName}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Sending Verification Code...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Send Verification Code
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Account Setup */}
        {currentStep === 'account-setup' && verificationResult && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">Email verified successfully!</p>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">Complete Your Setup</h1>
            <p className="text-slate-600 mb-6">Create your admin account to access the platform</p>

            <form onSubmit={handleAccountSetup} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 4: Pending Approval */}
        {currentStep === 'pending-approval' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">Registration Successful!</h1>
            <p className="text-slate-600 mb-6">
              Your registration for <strong>{selectedUniversity.name}</strong> has been submitted successfully.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-slate-900 mb-4">What happens next?</h3>
              <ol className="space-y-3 text-sm text-slate-700">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600">1.</span>
                  <span>Our team will review your registration within 2-3 business days</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600">2.</span>
                  <span>You'll receive an approval email with your admin credentials</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600">3.</span>
                  <span>Log in and start managing your university</span>
                </li>
              </ol>
            </div>

            <p className="text-sm text-slate-500 mb-6">
              A confirmation email has been sent to <strong>{formData.email}</strong>
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setLocation(`/status/${registrationId}`)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Track Status
              </button>
              <button
                onClick={() => setLocation('/signin')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Go to Sign In
              </button>
            </div>

            {/* Contact Details Card */}
            <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
