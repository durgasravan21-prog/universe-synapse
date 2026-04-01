import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import OwnerDashboard from './OwnerDashboard';
import AdminDashboard from './AdminDashboard';
import StaffDashboard from './StaffDashboard';
import StudentDashboard from './StudentDashboard';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to appropriate dashboard based on role
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/');
      return;
    }

    if (user) {
      if (user.role === 'owner') {
        setLocation('/owner/dashboard');
      } else if (user.role === 'admin') {
        setLocation('/admin/dashboard');
      } else if (user.role === 'staff') {
        setLocation('/staff/dashboard');
      } else if (user.role === 'student') {
        setLocation('/student/dashboard');
      }
    }
  }, [isAuthenticated, user, setLocation]);

  // Render dashboard based on role
  if (!isAuthenticated) {
    return null;
  }

  switch (user?.role) {
    case 'owner':
      return <OwnerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'staff':
      return <StaffDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return null;
  }
}
