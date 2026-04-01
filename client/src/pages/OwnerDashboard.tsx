import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Building2, Users, AlertCircle } from 'lucide-react';

export default function OwnerDashboard() {
  const { universities, registerUniversity } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', domain: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const uni = await registerUniversity(formData.name, formData.domain, 'admin@' + formData.domain.toLowerCase() + '.edu');
      setSuccess(
        `University registered! Admin email: ${uni.adminEmail}`
      );
      setFormData({ name: '', domain: '' });
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register university');
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = universities.reduce((acc, uni) => acc + 1, 0); // At least 1 admin per uni

  return (
    <Layout title="Platform Dashboard" breadcrumbs={[{ label: 'Owner' }, { label: 'Dashboard' }]}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-elevated p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Universities</p>
                <p className="text-4xl font-bold text-primary mt-2">{universities.length}</p>
              </div>
              <Building2 className="text-accent" size={32} />
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Administrators</p>
                <p className="text-4xl font-bold text-primary mt-2">{universities.length}</p>
              </div>
              <Users className="text-accent" size={32} />
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">System Users</p>
                <p className="text-4xl font-bold text-primary mt-2">{totalUsers}</p>
              </div>
              <Users className="text-accent" size={32} />
            </div>
          </div>
        </div>

        {/* Register University Section */}
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-primary">Registered Universities</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Register University</span>
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-[#10b981] opacity-10 border border-success rounded-md">
              <p className="text-[#10b981] text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-[#ef4444] opacity-10 border border-error rounded-md flex items-start space-x-3">
              <AlertCircle className="text-[#ef4444] flex-shrink-0 mt-0.5" size={20} />
              <p className="text-[#ef4444] text-sm">{error}</p>
            </div>
          )}

          {/* Registration Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-8 p-6 bg-secondary rounded-lg border border-border space-y-4">
              <div className="form-group">
                <label className="form-label">University Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Harvard University"
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Domain</label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="e.g., harvard.edu"
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register University'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Universities List */}
          {universities.length > 0 ? (
            <div className="space-y-4">
              {universities.map((uni) => (
                <div key={uni.id} className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{uni.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Domain: {uni.domain}</p>
                      <div className="mt-3 p-3 bg-input rounded text-sm">
                        <p className="text-xs text-muted-foreground mb-1">Admin Email:</p>
                        <p className="font-mono text-foreground">{uni.adminEmail}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Registered: {new Date(uni.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:opacity-90 transition-all text-sm font-medium">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="mx-auto text-muted-foreground mb-4" size={48} />
              <p className="text-muted-foreground">No universities registered yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Register your first university to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
