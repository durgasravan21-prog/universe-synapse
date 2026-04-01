import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Trash2, Edit2, Mail, Shield, User } from 'lucide-react';
import { addDepartmentMember, getDepartmentMembersByRole, type DepartmentMember, type DepartmentRole } from '@/data/departments';

interface DepartmentMemberManagementProps {
  params?: { id?: string };
}

/**
 * Department Member Management
 * Manage staff and students within a department
 */
export default function DepartmentMemberManagement({ params }: DepartmentMemberManagementProps) {
  const departmentId = params?.id || 'dept_001';
  const departmentName = 'Computer Science & Engineering';
  const [members, setMembers] = useState<DepartmentMember[]>([
    {
      id: 'member_001',
      departmentId,
      userId: 'user_001',
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@synapse.in',
      role: 'department_head',
      joinedAt: new Date('2024-01-15'),
      status: 'active',
    },
    {
      id: 'member_002',
      departmentId,
      userId: 'user_002',
      name: 'Prof. Meera Sharma',
      email: 'meera.sharma@synapse.in',
      role: 'department_admin',
      joinedAt: new Date('2024-02-01'),
      status: 'active',
    },
    {
      id: 'member_003',
      departmentId,
      userId: 'user_003',
      name: 'Dr. Arjun Patel',
      email: 'arjun.patel@synapse.in',
      role: 'staff',
      joinedAt: new Date('2024-03-01'),
      status: 'active',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | DepartmentRole>('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'staff' as DepartmentRole,
  });

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || m.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    const newMember = addDepartmentMember(
      departmentId,
      `user_${Date.now()}`,
      formData.name,
      formData.email,
      formData.role
    );

    setMembers([...members, newMember]);
    setFormData({ name: '', email: '', role: 'staff' });
    setShowAddForm(false);
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('Are you sure you want to remove this member from the department?')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const getRoleColor = (role: DepartmentRole) => {
    switch (role) {
      case 'department_head':
        return 'bg-purple-100 text-purple-700';
      case 'department_admin':
        return 'bg-blue-100 text-blue-700';
      case 'staff':
        return 'bg-slate-100 text-slate-700';
      case 'student':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getRoleIcon = (role: DepartmentRole) => {
    switch (role) {
      case 'department_head':
        return <Shield className="w-4 h-4" />;
      case 'department_admin':
        return <Shield className="w-4 h-4" />;
      case 'staff':
        return <User className="w-4 h-4" />;
      case 'student':
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Department Members</h2>
          <p className="text-slate-600 mt-1">{departmentName}</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Member
        </Button>
      </div>

      {/* Add Member Form */}
      {showAddForm && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Add New Member</h3>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as DepartmentRole })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 hover:border-slate-400 transition-colors"
              >
                <option value="staff">Staff Member</option>
                <option value="student">Student</option>
                <option value="department_admin">Department Admin</option>
                <option value="department_head">Department Head</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
              >
                Add Member
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search members by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as any)}
          className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 hover:border-slate-400 transition-colors"
        >
          <option value="all">All Roles</option>
          <option value="department_head">Department Head</option>
          <option value="department_admin">Department Admin</option>
          <option value="staff">Staff</option>
          <option value="student">Students</option>
        </select>
      </div>

      {/* Members List */}
      <div className="space-y-3">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <Card key={member.id} className="p-4 hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{member.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <a href={`mailto:${member.email}`} className="text-sm text-blue-600 hover:text-blue-700">
                          {member.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${getRoleColor(member.role)}`}>
                    {getRoleIcon(member.role)}
                    {member.role.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    member.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-slate-600"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3 ml-13">
                Joined: {member.joinedAt.toLocaleDateString()}
              </p>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Members Found</h3>
            <p className="text-slate-600">
              {searchQuery ? 'No members match your search.' : 'Add members to this department to get started.'}
            </p>
          </Card>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <p className="text-xs text-purple-700 font-semibold mb-1">Department Heads</p>
          <p className="text-2xl font-bold text-purple-900">
            {members.filter(m => m.role === 'department_head').length}
          </p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <p className="text-xs text-blue-700 font-semibold mb-1">Admins</p>
          <p className="text-2xl font-bold text-blue-900">
            {members.filter(m => m.role === 'department_admin').length}
          </p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <p className="text-xs text-slate-700 font-semibold mb-1">Staff</p>
          <p className="text-2xl font-bold text-slate-900">
            {members.filter(m => m.role === 'staff').length}
          </p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <p className="text-xs text-green-700 font-semibold mb-1">Students</p>
          <p className="text-2xl font-bold text-green-900">
            {members.filter(m => m.role === 'student').length}
          </p>
        </Card>
      </div>
    </div>
  );
}
