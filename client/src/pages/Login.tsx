import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Redirect based on role - handled in App.tsx
      setLocation('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-primary text-white rounded-lg p-3 mb-4">
              <span className="text-2xl font-bold">US</span>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">UniVerse Synapse</h1>
            <p className="text-muted-foreground">Multi-Tenant University Platform</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-[#ef4444] opacity-10 border border-error rounded-md flex items-start space-x-3">
              <AlertCircle className="text-[#ef4444] flex-shrink-0 mt-0.5" size={20} />
              <p className="text-[#ef4444] text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@synapse.in"
                className="form-input"
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Use your @synapse.in email or platform owner email
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Demo: Use any password
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Demo Info */}
          <div className="mt-8 p-4 bg-secondary rounded-md border border-border">
            <p className="text-xs font-semibold text-foreground mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                <strong>Owner:</strong> owner@synapse.in
              </p>
              <p>
                <strong>Admin:</strong> harvard.admin.001@synapse.in
              </p>
              <p>
                <strong>Staff:</strong> staff@synapse.in
              </p>
              <p>
                <strong>Student:</strong> student@synapse.in
              </p>
              <p className="mt-2">
                <strong>Password:</strong> any password (demo mode)
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white opacity-80 text-sm">
            © 2026 UniVerse Synapse. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
