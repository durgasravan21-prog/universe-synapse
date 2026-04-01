import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function SignUp() {
  const { registerUniversity } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    universityName: '',
    domain: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.universityName.trim()) {
      setError('University name is required');
      return;
    }
    if (!formData.domain.trim()) {
      setError('Domain is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
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
      await registerUniversity(formData.universityName, formData.domain, formData.email);
      // After successful registration, redirect to signin
      setLocation('/signin');
    } catch (err) {
      setError('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setLocation('/')}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">US</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">UniVerse Synapse</h1>
          </div>
          <p className="text-slate-600">Register your university</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* University Name */}
            <div>
              <label htmlFor="universityName" className="block text-sm font-semibold text-slate-900 mb-2">
                University Name
              </label>
              <input
                id="universityName"
                name="universityName"
                type="text"
                value={formData.universityName}
                onChange={handleChange}
                placeholder="e.g., Harvard University"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50"
                required
              />
            </div>

            {/* Domain */}
            <div>
              <label htmlFor="domain" className="block text-sm font-semibold text-slate-900 mb-2">
                University Domain
              </label>
              <div className="flex items-center">
                <input
                  id="domain"
                  name="domain"
                  type="text"
                  value={formData.domain}
                  onChange={handleChange}
                  placeholder="harvard"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50"
                  required
                />
                <div className="px-4 py-3 bg-slate-100 border border-l-0 border-slate-300 rounded-r-lg text-slate-600 font-medium">
                  .synapse.in
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                Admin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-900 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-600">Already have an account?</span>
            </div>
          </div>

          {/* Sign In Link */}
          <button
            onClick={() => setLocation('/signin')}
            className="w-full px-4 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all"
          >
            Sign In
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-sm mt-6">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
