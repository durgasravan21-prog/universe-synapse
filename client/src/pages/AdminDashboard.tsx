import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth, User } from '@/contexts/AuthContext';
import { Plus, Users, AlertCircle, Trash2, Building2 } from 'lucide-react';
import { useLocation } from 'wouter';

export default function AdminDashboard() {
  const { user, createStaff, createStudent, getUniversityUsers, deleteUser } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'staff' | 'students' | 'departments'>('staff');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!user?.universityId) {
    return <Layout title="Dashboard">Not authorized</Layout>;
  }

  const universityUsers = getUniversityUsers(user.universityId!);
  const staffMembers = universityUsers.filter(u => u.role === 'staff');
  const students = universityUsers.filter(u => u.role === 'student');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (activeTab === 'staff') {
        await createStaff(user.universityId!, formData.name, formData.email);
        setSuccess(`Staff member ${formData.name} created successfully`);
      } else {
        await createStudent(user.universityId!, formData.name, formData.email);
        setSuccess(`Student ${formData.name} created successfully`);
      }
      setFormData({ name: '', email: '' });
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      setSuccess('User deleted successfully');
    }
  };

  return (
    <Layout
      title="University Administration"
      breadcrumbs={[{ label: 'Admin' }, { label: 'Dashboard' }]}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-elevated p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">University</p>
                <p className="text-2xl font-bold text-primary mt-2">{user.universityName}</p>
              </div>
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Staff Members</p>
                <p className="text-4xl font-bold text-primary mt-2">{staffMembers.length}</p>
              </div>
              <Users className="text-accent" size={32} />
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Students</p>
                <p className="text-4xl font-bold text-primary mt-2">{students.length}</p>
              </div>
              <Users className="text-accent" size={32} />
            </div>
          </div>
        </div>

        {/* Admin Email Info */}
        <div className="card-elevated p-6 bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-900 mb-2">Your Admin Email:</p>
          <p className="font-mono text-lg font-semibold text-blue-900">{user.email}</p>
          <p className="text-xs text-blue-800 mt-2">
            Use this email to log in and manage your university
          </p>
        </div>

        {/* Tabs */}
        <div className="card-elevated">
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('staff')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'staff'
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Staff Members ({staffMembers.length})
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'students'
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Students ({students.length})
            </button>
          </div>

          <div className="p-6">
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

            {/* Add User Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>
                  Add {activeTab === 'staff' ? 'Staff Member' : 'Student'}
                </span>
              </button>
            </div>

            {/* Add User Form */}
            {showForm && (
              <form
                onSubmit={handleSubmit}
                className="mb-8 p-6 bg-secondary rounded-lg border border-border space-y-4"
              >
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., John Doe"
                    className="form-input"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g., john.doe@synapse.in"
                    className="form-input"
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Must use @synapse.in domain
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : `Create ${activeTab === 'staff' ? 'Staff Member' : 'Student'}`}
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

            {/* Users List */}
            {(activeTab === 'staff' ? staffMembers : students).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeTab === 'staff' ? staffMembers : students).map((u) => (
                      <tr key={u.id}>
                        <td className="font-medium">{u.name}</td>
                        <td className="font-mono text-sm">{u.email}</td>
                        <td>
                          <span className={`badge ${
                            u.role === 'staff' ? 'badge-info' : 'badge-warning'
                          }`}>
                            {u.role === 'staff' ? 'Staff' : 'Student'}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="text-[#ef4444] hover:text-[#ef4444] hover:bg-[#ef4444] hover:opacity-10 p-2 rounded transition-colors"
                            title="Delete user"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto text-muted-foreground mb-4" size={48} />
                <p className="text-muted-foreground">
                  No {activeTab === 'staff' ? 'staff members' : 'students'} yet
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add your first {activeTab === 'staff' ? 'staff member' : 'student'} to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
