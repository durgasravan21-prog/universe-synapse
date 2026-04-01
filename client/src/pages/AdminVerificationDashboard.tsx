import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { CheckCircle, XCircle, Clock, LogOut, Search, Filter } from 'lucide-react';

export default function AdminVerificationDashboard() {
  const { user, logout, getPendingVerifications, approveUniversity, rejectUniversity } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [selectedUniversity, setSelectedUniversity] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const pendingVerifications = getPendingVerifications();

  // Filter universities
  const filteredUniversities = pendingVerifications.filter(uni => {
    const matchesSearch =
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.registrationEmail.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && uni.verificationStatus === filterStatus;
  });

  const handleApprove = async (universityId: string) => {
    setLoading(true);
    try {
      await approveUniversity(universityId, user?.id || 'admin');
      setSelectedUniversity(null);
    } catch (err) {
      console.error('Failed to approve university:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedUniversity || !rejectionReason.trim()) {
      return;
    }

    setLoading(true);
    try {
      await rejectUniversity(selectedUniversity.id, rejectionReason);
      setShowRejectModal(false);
      setSelectedUniversity(null);
      setRejectionReason('');
    } catch (err) {
      console.error('Failed to reject university:', err);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'platform-admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h1>
          <p className="text-slate-600 mb-6">You don't have permission to access this page.</p>
          <button
            onClick={() => setLocation('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">US</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">UniVerse Synapse</h1>
              <p className="text-xs text-slate-600">Admin Verification Dashboard</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-600">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                logout();
                setLocation('/');
              }}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} className="text-slate-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">University Verification</h2>
          <p className="text-slate-600">
            Review and approve pending university registrations. All universities must verify their official email domain.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Pending Review</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {pendingVerifications.filter(u => u.verificationStatus === 'pending').length}
                </p>
              </div>
              <Clock className="text-amber-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Verified</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {pendingVerifications.filter(u => u.verificationStatus === 'verified').length}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Rejected</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {pendingVerifications.filter(u => u.verificationStatus === 'rejected').length}
                </p>
              </div>
              <XCircle className="text-red-600" size={32} />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by university name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-slate-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Universities List */}
        <div className="space-y-4">
          {filteredUniversities.length > 0 ? (
            filteredUniversities.map(uni => (
              <div
                key={uni.id}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{uni.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          uni.verificationStatus === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : uni.verificationStatus === 'verified'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {uni.verificationStatus === 'pending'
                          ? 'Pending Review'
                          : uni.verificationStatus === 'verified'
                          ? 'Verified'
                          : 'Rejected'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Domain</p>
                        <p className="font-semibold text-slate-900">{uni.domain}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Registration Email</p>
                        <p className="font-semibold text-slate-900">{uni.registrationEmail}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Admin Email</p>
                        <p className="font-semibold text-slate-900">{uni.adminEmail}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Registered</p>
                        <p className="font-semibold text-slate-900">
                          {new Date(uni.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {uni.rejectionReason && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Rejection Reason:</strong> {uni.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>

                  {uni.verificationStatus === 'pending' && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleApprove(uni.id)}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <CheckCircle size={18} />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUniversity(uni);
                          setShowRejectModal(true);
                        }}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <XCircle size={18} />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <Clock className="mx-auto text-slate-400 mb-4" size={48} />
              <p className="text-slate-600 text-lg">No universities found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedUniversity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Reject University Registration</h3>

            <p className="text-slate-600 mb-6">
              Are you sure you want to reject <strong>{selectedUniversity.name}</strong>? Please provide a reason.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason (e.g., Invalid email domain, Duplicate registration, etc.)"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 resize-none"
              rows={4}
            />

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedUniversity(null);
                  setRejectionReason('');
                }}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={loading || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
