import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Trash2, Users, BookOpen, Search, Filter, ChevronRight } from 'lucide-react';
import { createDepartment, searchDepartments, COMMON_DEPARTMENTS, type Department } from '@/data/departments';

/**
 * Department Management Page
 * Allows university admins to create, edit, and manage departments
 */
export default function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>([
    createDepartment('uni_001', 'Computer Science & Engineering', 'CSE', 'Computer Science and Software Engineering', 'admin_001'),
    createDepartment('uni_001', 'Mechanical Engineering', 'MECH', 'Mechanical Engineering Department', 'admin_001'),
    createDepartment('uni_001', 'Electrical Engineering', 'EEE', 'Electrical and Electronics Engineering', 'admin_001'),
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    building: '',
    email: '',
  });

  const filteredDepartments = searchDepartments(
    departments.filter(d => filterStatus === 'all' || d.status === filterStatus),
    searchQuery
  );

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code) {
      alert('Please fill in all required fields');
      return;
    }

    const newDept = createDepartment(
      'uni_001',
      formData.name,
      formData.code.toUpperCase(),
      formData.description,
      'admin_001'
    );

    setDepartments([...departments, newDept]);
    setFormData({ name: '', code: '', description: '', building: '', email: '' });
    setShowCreateForm(false);
  };

  const handleDeleteDepartment = (id: string) => {
    if (confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(d => d.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Department Management</h1>
          <p className="text-slate-600">Create and manage departments within your university</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 hover:border-slate-400 transition-colors"
          >
            <option value="all">All Departments</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            New Department
          </Button>
        </div>

        {/* Create Department Form */}
        {showCreateForm && (
          <Card className="mb-8 p-8 bg-blue-50 border-blue-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Department</h2>
            <form onSubmit={handleCreateDepartment} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Department Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Computer Science & Engineering"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Department Code *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., CSE"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    maxLength={10}
                    className="w-full uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Brief description of the department"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Building/Location
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Building A, Floor 3"
                    value={formData.building}
                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Department Email
                  </label>
                  <Input
                    type="email"
                    placeholder="e.g., cse@university.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Create Department
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Quick Add Suggestions */}
        {departments.length === 0 && !showCreateForm && (
          <Card className="mb-8 p-8 bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Add Common Departments</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {COMMON_DEPARTMENTS.slice(0, 8).map((dept) => (
                <button
                  key={dept.code}
                  onClick={() => {
                    const newDept = createDepartment(
                      'uni_001',
                      dept.name,
                      dept.code,
                      dept.description,
                      'admin_001'
                    );
                    setDepartments([...departments, newDept]);
                  }}
                  className="p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all text-left"
                >
                  <p className="font-semibold text-sm text-slate-900">{dept.code}</p>
                  <p className="text-xs text-slate-600 truncate">{dept.name}</p>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Departments Grid */}
        <div className="grid gap-6">
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((dept) => (
              <Card key={dept.id} className="p-6 hover:shadow-lg transition-all border-l-4 border-l-blue-600">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{dept.name}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                        {dept.code}
                      </span>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        dept.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {dept.status.charAt(0).toUpperCase() + dept.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-3">{dept.description}</p>
                    
                    {dept.headName && (
                      <p className="text-sm text-slate-600 mb-2">
                        <strong>Head:</strong> {dept.headName}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleDeleteDepartment(dept.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-slate-600">Staff</p>
                      <p className="font-bold text-slate-900">{dept.totalStaff}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-xs text-slate-600">Students</p>
                      <p className="font-bold text-slate-900">{dept.totalStudents}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-slate-600">Courses</p>
                      <p className="font-bold text-slate-900">{dept.activeCourses}</p>
                    </div>
                  </div>
                  <button className="flex items-center justify-end gap-2 text-blue-600 hover:text-blue-700 font-semibold">
                    Manage <ChevronRight size={16} />
                  </button>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Departments Found</h3>
              <p className="text-slate-600 mb-6">
                {searchQuery ? 'No departments match your search.' : 'Create your first department to get started.'}
              </p>
              {!showCreateForm && (
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus size={20} className="mr-2" />
                  Create Department
                </Button>
              )}
            </Card>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <p className="text-sm text-blue-700 font-semibold mb-2">Total Departments</p>
            <p className="text-4xl font-bold text-blue-900">{departments.length}</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <p className="text-sm text-green-700 font-semibold mb-2">Active Departments</p>
            <p className="text-4xl font-bold text-green-900">
              {departments.filter(d => d.status === 'active').length}
            </p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <p className="text-sm text-purple-700 font-semibold mb-2">Total Members</p>
            <p className="text-4xl font-bold text-purple-900">
              {departments.reduce((sum, d) => sum + d.totalStaff + d.totalStudents, 0)}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
