import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Award, TrendingUp, Mail, Phone, MapPin, Plus, Edit2 } from 'lucide-react';
import { type Department, type DepartmentMember, type DepartmentCourse } from '@/data/departments';

interface DepartmentDashboardProps {
  params?: { id?: string };
}

/**
 * Department-Specific Dashboard
 * Shows department head and admin with department-specific information
 */
export default function DepartmentDashboard({ params }: DepartmentDashboardProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'staff' | 'students' | 'courses'>('overview');

  // Mock data
  const mockDepartment: Department = {
    id: 'dept_001',
    universityId: 'uni_001',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    description: 'Department of Computer Science and Software Engineering',
    headId: 'user_001',
    headName: 'Dr. Rajesh Kumar',
    headEmail: 'rajesh.kumar@synapse.in',
    building: 'Building A',
    floor: '3rd Floor',
    officeLocation: 'Room 301',
    phone: '+91-XXXX-XXXX-XXXX',
    email: 'cse@university.edu',
    website: 'cse.university.edu',
    totalStaff: 24,
    totalStudents: 320,
    activeCourses: 12,
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    createdBy: 'admin_001',
    allowStudentEnrollment: true,
    requireDepartmentHeadApproval: false,
  };

  const mockStaff: DepartmentMember[] = [
    {
      id: 'member_001',
      departmentId: 'dept_001',
      userId: 'user_001',
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@synapse.in',
      role: 'department_head',
      joinedAt: new Date('2024-01-15'),
      status: 'active',
    },
    {
      id: 'member_002',
      departmentId: 'dept_001',
      userId: 'user_002',
      name: 'Prof. Meera Sharma',
      email: 'meera.sharma@synapse.in',
      role: 'department_admin',
      joinedAt: new Date('2024-02-01'),
      status: 'active',
    },
    {
      id: 'member_003',
      departmentId: 'dept_001',
      userId: 'user_003',
      name: 'Dr. Arjun Patel',
      email: 'arjun.patel@synapse.in',
      role: 'staff',
      joinedAt: new Date('2024-03-01'),
      status: 'active',
    },
  ];

  const mockCourses: DepartmentCourse[] = [
    {
      id: 'course_001',
      departmentId: 'dept_001',
      courseCode: 'CSE101',
      courseName: 'Introduction to Programming',
      instructorId: 'user_003',
      instructorName: 'Dr. Arjun Patel',
      semester: 'Spring 2026',
      enrolledStudents: 45,
      maxCapacity: 50,
      status: 'active',
      createdAt: new Date(),
    },
    {
      id: 'course_002',
      departmentId: 'dept_001',
      courseCode: 'CSE201',
      courseName: 'Data Structures',
      instructorId: 'user_003',
      instructorName: 'Dr. Arjun Patel',
      semester: 'Spring 2026',
      enrolledStudents: 38,
      maxCapacity: 40,
      status: 'active',
      createdAt: new Date(),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {mockDepartment.name}
              </h1>
              <p className="text-slate-600">
                Department Code: <span className="font-semibold">{mockDepartment.code}</span>
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <Edit2 size={18} />
              Edit Department
            </Button>
          </div>

          {/* Department Info Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-4 bg-white border-l-4 border-l-blue-600">
              <p className="text-sm text-slate-600 mb-1">Department Head</p>
              <p className="font-semibold text-slate-900">{mockDepartment.headName}</p>
              <p className="text-xs text-slate-500 mt-1">{mockDepartment.headEmail}</p>
            </Card>
            <Card className="p-4 bg-white border-l-4 border-l-teal-600">
              <p className="text-sm text-slate-600 mb-1">Location</p>
              <p className="font-semibold text-slate-900">{mockDepartment.building}</p>
              <p className="text-xs text-slate-500 mt-1">{mockDepartment.officeLocation}</p>
            </Card>
            <Card className="p-4 bg-white border-l-4 border-l-purple-600">
              <p className="text-sm text-slate-600 mb-1">Contact</p>
              <p className="font-semibold text-slate-900">{mockDepartment.email}</p>
              <p className="text-xs text-slate-500 mt-1">{mockDepartment.phone}</p>
            </Card>
            <Card className="p-4 bg-white border-l-4 border-l-green-600">
              <p className="text-sm text-slate-600 mb-1">Status</p>
              <p className="font-semibold text-green-600">
                {mockDepartment.status.charAt(0).toUpperCase() + mockDepartment.status.slice(1)}
              </p>
              <p className="text-xs text-slate-500 mt-1">Active since Jan 2024</p>
            </Card>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-slate-200">
          {(['overview', 'staff', 'students', 'courses'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                selectedTab === tab
                  ? 'text-blue-600 border-b-blue-600'
                  : 'text-slate-600 border-b-transparent hover:text-slate-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 font-semibold mb-1">Total Staff</p>
                    <p className="text-3xl font-bold text-blue-900">{mockDepartment.totalStaff}</p>
                  </div>
                  <Users className="w-12 h-12 text-blue-300" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-teal-700 font-semibold mb-1">Total Students</p>
                    <p className="text-3xl font-bold text-teal-900">{mockDepartment.totalStudents}</p>
                  </div>
                  <Users className="w-12 h-12 text-teal-300" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700 font-semibold mb-1">Active Courses</p>
                    <p className="text-3xl font-bold text-purple-900">{mockDepartment.activeCourses}</p>
                  </div>
                  <BookOpen className="w-12 h-12 text-purple-300" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 font-semibold mb-1">Avg Class Size</p>
                    <p className="text-3xl font-bold text-green-900">
                      {Math.round(mockDepartment.totalStudents / mockDepartment.activeCourses)}
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-green-300" />
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 h-12">
                  <Plus size={18} />
                  Add Staff
                </Button>
                <Button className="bg-teal-600 hover:bg-teal-700 flex items-center justify-center gap-2 h-12">
                  <Plus size={18} />
                  Enroll Students
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2 h-12">
                  <Plus size={18} />
                  Create Course
                </Button>
                <Button variant="outline" className="flex items-center justify-center gap-2 h-12">
                  <Mail size={18} />
                  Send Announcement
                </Button>
              </div>
            </Card>

            {/* Department Description */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">About This Department</h3>
              <p className="text-slate-700 leading-relaxed mb-6">
                {mockDepartment.description}
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-600 font-semibold mb-2">Contact Information</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail size={16} className="text-blue-600" />
                      <a href={`mailto:${mockDepartment.email}`} className="hover:text-blue-600">
                        {mockDepartment.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone size={16} className="text-blue-600" />
                      <span>{mockDepartment.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin size={16} className="text-blue-600" />
                      <span>{mockDepartment.officeLocation}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-semibold mb-2">Department Settings</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-slate-700">
                      <input type="checkbox" checked={mockDepartment.allowStudentEnrollment} readOnly className="w-4 h-4" />
                      Allow Student Self-Enrollment
                    </label>
                    <label className="flex items-center gap-2 text-slate-700">
                      <input type="checkbox" checked={mockDepartment.requireDepartmentHeadApproval} readOnly className="w-4 h-4" />
                      Require Head Approval for Enrollments
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Staff Tab */}
        {selectedTab === 'staff' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Department Staff</h3>
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                <Plus size={18} />
                Add Staff Member
              </Button>
            </div>
            <div className="grid gap-4">
              {mockStaff.map((member) => (
                <Card key={member.id} className="p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-slate-900">{member.name}</h4>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          member.role === 'department_head'
                            ? 'bg-purple-100 text-purple-700'
                            : member.role === 'department_admin'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {member.role.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-600">{member.email}</p>
                      <p className="text-sm text-slate-500 mt-2">
                        Joined: {member.joinedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit2 size={16} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {selectedTab === 'students' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Enrolled Students</h3>
              <Button className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2">
                <Plus size={18} />
                Enroll Students
              </Button>
            </div>
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">
                {mockDepartment.totalStudents} students are enrolled in this department
              </p>
              <p className="text-sm text-slate-500">
                Manage student enrollments, view progress, and track academic performance
              </p>
            </Card>
          </div>
        )}

        {/* Courses Tab */}
        {selectedTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Active Courses</h3>
              <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
                <Plus size={18} />
                Create Course
              </Button>
            </div>
            <div className="grid gap-4">
              {mockCourses.map((course) => (
                <Card key={course.id} className="p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-slate-900">{course.courseName}</h4>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                          {course.courseCode}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-2">Instructor: {course.instructorName}</p>
                      <p className="text-sm text-slate-500">Semester: {course.semester}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit2 size={16} />
                    </Button>
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">
                        Enrollment: {course.enrolledStudents} / {course.maxCapacity}
                      </span>
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-teal-600 h-2 rounded-full"
                          style={{ width: `${(course.enrolledStudents / course.maxCapacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
