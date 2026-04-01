import React from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, FileText, Award, Clock } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();

  const mockCourses = [
    { id: 1, name: 'Introduction to Computer Science', code: 'CS101', instructor: 'Dr. Smith', grade: 'A' },
    { id: 2, name: 'Data Structures', code: 'CS201', instructor: 'Prof. Johnson', grade: 'A-' },
    { id: 3, name: 'Web Development', code: 'CS301', instructor: 'Dr. Williams', grade: 'B+' },
  ];

  const mockAssignments = [
    { id: 1, course: 'CS101', name: 'Assignment 1: Variables', dueDate: '2026-03-28', status: 'submitted', grade: 95 },
    { id: 2, course: 'CS201', name: 'Assignment 2: Trees', dueDate: '2026-04-04', status: 'pending', grade: null },
    { id: 3, course: 'CS301', name: 'Project: Build a Web App', dueDate: '2026-04-15', status: 'not_started', grade: null },
  ];

  const gpa = 3.65;

  return (
    <Layout
      title="Student Dashboard"
      breadcrumbs={[{ label: 'Student' }, { label: 'Dashboard' }]}
    >
      <div className="space-y-6">
        {/* Welcome */}
        <div className="card-elevated p-8 bg-gradient-to-r from-primary to-primary-foreground text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h2>
          <p className="text-white opacity-90">
            Track your courses, assignments, and academic progress.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card-elevated p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Enrolled Courses</p>
                <p className="text-4xl font-bold text-primary mt-2">{mockCourses.length}</p>
              </div>
              <BookOpen className="text-accent" size={32} />
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Current GPA</p>
                <p className="text-4xl font-bold text-primary mt-2">{gpa.toFixed(2)}</p>
              </div>
              <Award className="text-accent" size={32} />
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Pending Assignments</p>
                <p className="text-4xl font-bold text-primary mt-2">
                  {mockAssignments.filter(a => a.status !== 'submitted').length}
                </p>
              </div>
              <FileText className="text-accent" size={32} />
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Submission Rate</p>
                <p className="text-4xl font-bold text-primary mt-2">
                  {Math.round(
                    (mockAssignments.filter(a => a.status === 'submitted').length /
                      mockAssignments.length) *
                      100
                  )}%
                </p>
              </div>
              <Clock className="text-accent" size={32} />
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="card-elevated p-6">
          <h2 className="text-2xl font-semibold text-primary mb-6">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockCourses.map((course) => (
              <div key={course.id} className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{course.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {course.code} • {course.instructor}
                    </p>
                    <div className="mt-3 flex items-center space-x-2">
                      <span className="text-xs font-medium text-muted-foreground">Grade:</span>
                      <span className="px-2 py-1 bg-[#10b981] opacity-20 text-[#10b981] rounded text-sm font-semibold">
                        {course.grade}
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:opacity-90 transition-all text-sm font-medium">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignments */}
        <div className="card-elevated p-6">
          <h2 className="text-2xl font-semibold text-primary mb-6">My Assignments</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Assignment</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {mockAssignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td className="font-medium text-sm">{assignment.course}</td>
                    <td>{assignment.name}</td>
                    <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          assignment.status === 'submitted'
                            ? 'badge-success'
                            : assignment.status === 'pending'
                            ? 'badge-warning'
                            : 'badge-error'
                        }`}
                      >
                        {assignment.status === 'submitted'
                          ? 'Submitted'
                          : assignment.status === 'pending'
                          ? 'Pending'
                          : 'Not Started'}
                      </span>
                    </td>
                    <td>
                      {assignment.grade ? (
                        <span className="font-semibold text-[#10b981]">{assignment.grade}%</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
