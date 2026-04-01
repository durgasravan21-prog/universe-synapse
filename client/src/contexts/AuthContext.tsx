import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'owner' | 'admin' | 'staff' | 'student' | 'platform-admin';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  universityId?: string;
  universityName?: string;
  adminEmail?: string;
  verificationStatus?: VerificationStatus;
}

export interface University {
  id: string;
  name: string;
  domain: string;
  adminEmail: string;
  adminCounter: number;
  createdAt: string;
  verificationStatus: VerificationStatus;
  verifiedDomain: string; // The official domain from verification database
  registrationEmail: string; // Email used during registration
  adminApprovedBy?: string; // Platform admin who approved
  adminApprovedAt?: string; // When it was approved
  rejectionReason?: string; // Reason if rejected
}

interface AuthContextType {
  user: User | null;
  universities: University[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  registerUniversity: (name: string, domain: string, email: string) => Promise<University>;
  createStaff: (universityId: string, name: string, email: string) => Promise<User>;
  createStudent: (universityId: string, name: string, email: string) => Promise<User>;
  getUniversityUsers: (universityId: string) => User[];
  updateUserRole: (userId: string, role: UserRole) => void;
  deleteUser: (userId: string) => void;
  getPendingVerifications: () => University[];
  approveUniversity: (universityId: string, platformAdminId: string) => Promise<void>;
  rejectUniversity: (universityId: string, reason: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data storage
const mockUsers: Map<string, User> = new Map();
const mockUniversities: Map<string, University> = new Map();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);

  const login = useCallback(async (email: string, password: string) => {
    // Simulate login - in real app, this would call backend
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if user exists
    let foundUser = Array.from(mockUsers.values()).find(u => u.email === email);

    if (!foundUser) {
      // Demo users for testing
      const demoUsers: { [key: string]: User } = {
        'owner@synapse.in': {
          id: 'owner-1',
          email: 'owner@synapse.in',
          name: 'Platform Owner',
          role: 'owner',
          verificationStatus: 'verified',
        },
        'harvard.admin.001@synapse.in': {
          id: 'admin-1',
          email: 'harvard.admin.001@synapse.in',
          name: 'Harvard Admin',
          role: 'admin',
          universityId: 'harvard',
          universityName: 'Harvard University',
          verificationStatus: 'verified',
        },
        'staff@synapse.in': {
          id: 'staff-1',
          email: 'staff@synapse.in',
          name: 'Staff Member',
          role: 'staff',
          universityId: 'harvard',
          universityName: 'Harvard University',
          verificationStatus: 'verified',
        },
        'student@synapse.in': {
          id: 'student-1',
          email: 'student@synapse.in',
          name: 'Student User',
          role: 'student',
          universityId: 'harvard',
          universityName: 'Harvard University',
          verificationStatus: 'verified',
        },
        'platform-admin@synapse.in': {
          id: 'platform-admin-1',
          email: 'platform-admin@synapse.in',
          name: 'Platform Admin',
          role: 'platform-admin',
          verificationStatus: 'verified',
        },
      };

      foundUser = demoUsers[email];
    }

    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    setUser(foundUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const registerUniversity = useCallback(
    async (name: string, domain: string, email: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));

      const universityId = domain.toLowerCase();
      const newUniversity: University = {
        id: universityId,
        name,
        domain,
        adminEmail: `${domain}.admin.001@synapse.in`,
        adminCounter: 1,
        createdAt: new Date().toISOString(),
        verificationStatus: 'pending',
        verifiedDomain: domain,
        registrationEmail: email,
      };

      mockUniversities.set(universityId, newUniversity);
      setUniversities([...universities, newUniversity]);

      return newUniversity;
    },
    [universities]
  );

  const createStaff = useCallback(
    async (universityId: string, name: string, email: string) => {
      await new Promise(resolve => setTimeout(resolve, 300));

      const newStaff: User = {
        id: `staff-${Date.now()}`,
        email,
        name,
        role: 'staff',
        universityId,
        verificationStatus: 'verified',
      };

      mockUsers.set(newStaff.id, newStaff);
      return newStaff;
    },
    []
  );

  const createStudent = useCallback(
    async (universityId: string, name: string, email: string) => {
      await new Promise(resolve => setTimeout(resolve, 300));

      const newStudent: User = {
        id: `student-${Date.now()}`,
        email,
        name,
        role: 'student',
        universityId,
        verificationStatus: 'verified',
      };

      mockUsers.set(newStudent.id, newStudent);
      return newStudent;
    },
    []
  );

  const getUniversityUsers = useCallback((universityId: string) => {
    return Array.from(mockUsers.values()).filter(u => u.universityId === universityId);
  }, []);

  const updateUserRole = useCallback((userId: string, role: UserRole) => {
    const user = mockUsers.get(userId);
    if (user) {
      user.role = role;
      mockUsers.set(userId, user);
    }
  }, []);

  const deleteUser = useCallback((userId: string) => {
    mockUsers.delete(userId);
  }, []);

  const getPendingVerifications = useCallback(() => {
    return Array.from(mockUniversities.values()).filter(
      uni => uni.verificationStatus === 'pending'
    );
  }, []);

  const approveUniversity = useCallback(
    async (universityId: string, platformAdminId: string) => {
      const university = mockUniversities.get(universityId);
      if (university) {
        university.verificationStatus = 'verified';
        university.adminApprovedBy = platformAdminId;
        university.adminApprovedAt = new Date().toISOString();
        mockUniversities.set(universityId, university);
        setUniversities(Array.from(mockUniversities.values()));
      }
    },
    []
  );

  const rejectUniversity = useCallback(
    async (universityId: string, reason: string) => {
      const university = mockUniversities.get(universityId);
      if (university) {
        university.verificationStatus = 'rejected';
        university.rejectionReason = reason;
        mockUniversities.set(universityId, university);
        setUniversities(Array.from(mockUniversities.values()));
      }
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        universities,
        isAuthenticated: !!user,
        login,
        logout,
        registerUniversity,
        createStaff,
        createStudent,
        getUniversityUsers,
        updateUserRole,
        deleteUser,
        getPendingVerifications,
        approveUniversity,
        rejectUniversity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
