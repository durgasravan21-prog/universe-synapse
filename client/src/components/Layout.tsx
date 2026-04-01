import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, breadcrumbs }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      owner: 'bg-purple-100 text-purple-800',
      admin: 'bg-blue-100 text-blue-800',
      staff: 'bg-green-100 text-green-800',
      student: 'bg-amber-100 text-amber-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      owner: 'Platform Owner',
      admin: 'University Admin',
      staff: 'Staff Member',
      student: 'Student',
    };
    return labels[role] || role;
  };

  return (
    <div className="flex h-screen bg-[#f5f3f0]">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 bg-primary text-white shadow-lg overflow-hidden`}
      >
        <div className="p-6 border-b border-white border-opacity-20">
          <h1 className="text-xl font-bold">UniVerse Synapse</h1>
          <p className="text-sm text-white opacity-80 mt-1">
            Multi-Tenant University Platform
          </p>
        </div>

        {user && (
          <div className="p-4 border-b border-white border-opacity-20">
            <div className="text-sm text-white opacity-80">
              <p className="font-medium text-white">{user.name}</p>
              <p className="text-xs text-white opacity-70 mt-1">{user.email}</p>
              {user.universityName && (
                <p className="text-xs text-white opacity-70 mt-1">
                  {user.universityName}
                </p>
              )}
            </div>
            <div className="mt-3">
              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getRoleColor(user.role)}`}>
                {getRoleLabel(user.role)}
              </span>
            </div>
          </div>
        )}

        <nav className="p-4 space-y-2">
          {user?.role === 'owner' && (
            <>
              <NavLink href="/owner/dashboard" label="Dashboard" />
              <NavLink href="/owner/universities" label="Universities" />
              <NavLink href="/owner/users" label="All Users" />
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <NavLink href="/admin/dashboard" label="Dashboard" />
              <NavLink href="/admin/staff" label="Manage Staff" />
              <NavLink href="/admin/students" label="Manage Students" />
              <NavLink href="/admin/settings" label="Settings" />
            </>
          )}
          {user?.role === 'staff' && (
            <>
              <NavLink href="/staff/dashboard" label="Dashboard" />
              <NavLink href="/staff/classes" label="My Classes" />
              <NavLink href="/staff/students" label="Students" />
            </>
          )}
          {user?.role === 'student' && (
            <>
              <NavLink href="/student/dashboard" label="Dashboard" />
              <NavLink href="/student/courses" label="My Courses" />
              <NavLink href="/student/grades" label="Grades" />
            </>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white border-opacity-20">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white opacity-20 hover:opacity-30 rounded-md transition-all text-sm font-medium"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-border shadow-sm">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-secondary rounded-md transition-colors"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div>
                {breadcrumbs && breadcrumbs.length > 0 && (
                  <div className="breadcrumb">
                    {breadcrumbs.map((crumb, idx) => (
                      <div key={idx} className="breadcrumb-item">
                        {crumb.href ? (
                          <a href={crumb.href} className="text-accent hover:underline">
                            {crumb.label}
                          </a>
                        ) : (
                          <span>{crumb.label}</span>
                        )}
                        {idx < breadcrumbs.length - 1 && (
                          <span className="breadcrumb-separator">/</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {title && <h1 className="text-2xl font-bold text-primary">{title}</h1>}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

interface NavLinkProps {
  href: string;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label }) => {
  return (
    <a
      href={href}
      className="block px-4 py-3 rounded-md text-sm font-medium hover:bg-white hover:opacity-20 transition-colors"
    >
      {label}
    </a>
  );
};
