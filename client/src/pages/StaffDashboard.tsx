import React from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Users, Calendar, FileText } from 'lucide-react';

export default function StaffDashboard() {
  const { user } = useAuth();

  const mockClasses = [
    { id: 1, name: 'Introduction to Computer Science', code: 'CS101', students: 45 },
    { id: 2, name: 'Data Structures', code: 'CS201', students: 38 },
    { id: 3, name: 'Web Development', code: 'CS301', students: 52 },
  ];

  const mockAssignments = [
    { id: 1, name: 'Assignment 1: Variables and Functions', dueDate: '2026-03-28', submitted: 32, total: 45 },
    { id: 2, name: 'Assignment 2: Object-Oriented Programming', dueDate: '2026-04-04', submitted: 28, total: 38 },
    { id: 3, name: 'Project: Build a Web App', dueDate: '2026-04-15', submitted: 0, total: 52 },
  ];

  return (
    <Layout
      title="Staff Dashboard"
      breadcrumbs={[{ label: 'Staff' }, { label: 'Dashboard' }]}
    >
      <div className="space-y-6">
        {/* Welcome */}
        <div className="card-elevated p-8 bg-gradient-to-r from-primary to-primary-foreground text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h2>
          <p className="text-white opacity-90">
            Manage your classes, assignments, and students from here.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card-elevated p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Classes</p>
                <p className="text-4xl font-bold text-primary mt-2">{mockClasses.length}</p>
              </div>
              <BookOpen className="text-accent" size={32} />
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Students</p>
                <p className="text-4xl font-bold text-primary mt-2">
                  {mockClasses.reduce((sum, c) => sum + c.students, 0)}
                </p>
              </div>
              <Users className="text-accent" size={32} />
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Pending Assignments</p>
                <p className="text-4xl font-bold text-primary mt-2">
                  {mockAssignments.filter(a => new Date(a.dueDate) > new Date()).length}
                </p>
              </div>
              <Calendar className="text-accent" size={32} />
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Avg. Submission Rate</p>
                <p className="text-4xl font-bold text-primary mt-2">
                  {Math.round(
                    (mockAssignments.reduce((sum, a) => sum + a.submitted, 0) /
                      mockAssignments.reduce((sum, a) => sum + a.total, 0)) *
                      100
                  )}%
                </p>
              </div>
              <FileText className="text-accent" size={32} />
            </div>
          </div>
        </div>

        {/* Classes */}
        <div className="card-elevated p-6">
          <h2 className="text-2xl font-semibold text-primary mb-6">My Classes</h2>
          <div className="space-y-4">
            {mockClasses.map((cls) => (
              <div key={cls.id} className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{cls.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Code: {cls.code} • {cls.students} Students
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:opacity-90 transition-all text-sm font-medium">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="card-elevated p-6">
          <h2 className="text-2xl font-semibold text-primary mb-6">Recent Assignments</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Assignment</th>
                  <th>Due Date</th>
                  <th>Submissions</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockAssignments.map((assignment) => {
                  const isOverdue = new Date(assignment.dueDate) < new Date();
                  return (
                    <tr key={assignment.id}>
                      <td className="font-medium">{assignment.name}</td>
                      <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
                      <td>
                        {assignment.submitted} / {assignment.total}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            isOverdue ? 'badge-error' : 'badge-success'
                          }`}
                        >
                          {isOverdue ? 'Overdue' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
