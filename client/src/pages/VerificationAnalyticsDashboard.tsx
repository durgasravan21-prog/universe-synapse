import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Download,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
} from 'lucide-react';
import {
  VerificationAnalyticsManager,
  type VerificationMetrics,
  type ApprovalTrend,
  type VerificationRecord,
} from '@/data/verificationAnalytics';

/**
 * Verification Analytics Dashboard
 * Displays key metrics and approval statistics
 */
export default function VerificationAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<VerificationMetrics | null>(null);
  const [trends, setTrends] = useState<ApprovalTrend[]>([]);
  const [rejectionReasons, setRejectionReasons] = useState<{ reason: string; count: number }[]>([]);
  const [universityDistribution, setUniversityDistribution] = useState<{ university: string; count: number }[]>([]);
  const [records, setRecords] = useState<VerificationRecord[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'trends' | 'records'>('overview');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const newMetrics = VerificationAnalyticsManager.calculateMetrics();
    const newTrends = VerificationAnalyticsManager.getApprovalTrends();
    const newRejectionReasons = VerificationAnalyticsManager.getRejectionReasons();
    const newUniversityDistribution = VerificationAnalyticsManager.getUniversityDistribution();
    const allRecords = VerificationAnalyticsManager.getAllRecords();

    setMetrics(newMetrics);
    setTrends(newTrends);
    setRejectionReasons(newRejectionReasons);
    setUniversityDistribution(newUniversityDistribution);
    setRecords(allRecords);
  };

  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesSearch =
      record.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.adminName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Export data
  const handleExport = () => {
    const data = {
      metrics,
      records,
      trends,
      rejectionReasons,
      universityDistribution,
      exportedAt: new Date().toISOString(),
    };

    const csv = convertToCSV(records);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `verification-report-${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const convertToCSV = (data: VerificationRecord[]): string => {
    const headers = ['University', 'Admin Email', 'Admin Name', 'Registration Date', 'Status', 'Email Verified', 'Approval Date', 'Verification Time (min)', 'Approval Time (hrs)'];
    const rows = data.map(record => [
      record.universityName,
      record.adminEmail,
      record.adminName,
      record.registrationDate.toISOString(),
      record.status,
      record.emailVerifiedDate?.toISOString() || 'N/A',
      record.approvalDate?.toISOString() || 'N/A',
      record.verificationTimeMinutes?.toFixed(2) || 'N/A',
      record.approvalTimeHours?.toFixed(2) || 'N/A',
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');
  };

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Verification Analytics</h1>
            <p className="text-slate-600">Monitor university registration and verification metrics</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={loadData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              onClick={handleExport}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Registrations */}
          <Card className="p-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase">Total Registrations</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">{metrics.totalRegistrations}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-blue-600 font-semibold">{metrics.todayRegistrations}</span>
              <span className="text-slate-600">today</span>
            </div>
          </Card>

          {/* Email Verified */}
          <Card className="p-6 border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase">Email Verified</p>
                <p className="text-4xl font-bold text-green-600 mt-2">{metrics.emailVerified}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 font-semibold">{metrics.verificationRate.toFixed(1)}%</span>
              <span className="text-slate-600">verification rate</span>
            </div>
          </Card>

          {/* Approved */}
          <Card className="p-6 border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-teal-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase">Approved</p>
                <p className="text-4xl font-bold text-teal-600 mt-2">{metrics.approved}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-teal-600 opacity-20" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-teal-600 font-semibold">{metrics.approvalRate.toFixed(1)}%</span>
              <span className="text-slate-600">approval rate</span>
            </div>
          </Card>

          {/* Rejected */}
          <Card className="p-6 border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase">Rejected</p>
                <p className="text-4xl font-bold text-red-600 mt-2">{metrics.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600 opacity-20" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-red-600 font-semibold">{metrics.rejectionRate.toFixed(1)}%</span>
              <span className="text-slate-600">rejection rate</span>
            </div>
          </Card>
        </div>

        {/* Time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Average Verification Time */}
          <Card className="p-6 border-2 border-purple-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase">Avg Verification Time</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {metrics.averageVerificationTime.toFixed(1)} <span className="text-lg">min</span>
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600 opacity-20" />
            </div>
            <p className="text-sm text-slate-600">Time from registration to email verification</p>
          </Card>

          {/* Average Approval Time */}
          <Card className="p-6 border-2 border-indigo-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase">Avg Approval Time</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">
                  {metrics.averageApprovalTime.toFixed(1)} <span className="text-lg">hrs</span>
                </p>
              </div>
              <Clock className="w-8 h-8 text-indigo-600 opacity-20" />
            </div>
            <p className="text-sm text-slate-600">Time from email verification to approval</p>
          </Card>
        </div>

        {/* Period Statistics */}
        <Card className="p-6 mb-8 border-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Registration Trends</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-slate-600 font-semibold mb-2">TODAY</p>
              <p className="text-3xl font-bold text-blue-600">{metrics.todayRegistrations}</p>
              <p className="text-xs text-slate-500 mt-2">registrations</p>
            </div>
            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <p className="text-sm text-slate-600 font-semibold mb-2">THIS WEEK</p>
              <p className="text-3xl font-bold text-teal-600">{metrics.weeklyRegistrations}</p>
              <p className="text-xs text-slate-500 mt-2">registrations</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-slate-600 font-semibold mb-2">THIS MONTH</p>
              <p className="text-3xl font-bold text-purple-600">{metrics.monthlyRegistrations}</p>
              <p className="text-xs text-slate-500 mt-2">registrations</p>
            </div>
          </div>
        </Card>

        {/* Status Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Rejection Reasons */}
          <Card className="p-6 border-2">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Top Rejection Reasons
            </h3>
            {rejectionReasons.length > 0 ? (
              <div className="space-y-3">
                {rejectionReasons.map((reason, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700">{reason.reason}</p>
                      <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500"
                          style={{
                            width: `${(reason.count / Math.max(...rejectionReasons.map(r => r.count), 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="ml-4 text-sm font-bold text-slate-900">{reason.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">No rejections yet</p>
            )}
          </Card>

          {/* Top Universities */}
          <Card className="p-6 border-2">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Top Universities
            </h3>
            {universityDistribution.length > 0 ? (
              <div className="space-y-3">
                {universityDistribution.map((uni, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700 truncate">{uni.university}</p>
                      <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${(uni.count / Math.max(...universityDistribution.map(u => u.count), 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="ml-4 text-sm font-bold text-slate-900">{uni.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">No data yet</p>
            )}
          </Card>
        </div>

        {/* Verification Records Table */}
        <Card className="p-6 border-2">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Verification Records</h3>
            <div className="flex gap-4 flex-wrap">
              <input
                type="text"
                placeholder="Search by university, email, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-64 px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="email-verified">Email Verified</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 px-4 font-bold text-slate-900">University</th>
                  <th className="text-left py-3 px-4 font-bold text-slate-900">Admin Email</th>
                  <th className="text-left py-3 px-4 font-bold text-slate-900">Status</th>
                  <th className="text-left py-3 px-4 font-bold text-slate-900">Registration Date</th>
                  <th className="text-left py-3 px-4 font-bold text-slate-900">Verification Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.slice(0, 10).map(record => (
                    <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-900">{record.universityName}</td>
                      <td className="py-3 px-4 text-slate-600">{record.adminEmail}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            record.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : record.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : record.status === 'email-verified'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {record.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {record.registrationDate.toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {record.verificationTimeMinutes ? `${record.verificationTimeMinutes.toFixed(0)} min` : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredRecords.length > 10 && (
            <div className="mt-4 text-sm text-slate-600 text-center">
              Showing 10 of {filteredRecords.length} records
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
