/**
 * Department Management System
 * Handles department creation, management, and organization
 */

export type DepartmentStatus = 'active' | 'inactive' | 'archived';
export type DepartmentRole = 'department_head' | 'department_admin' | 'staff' | 'student';

export interface Department {
  id: string;
  universityId: string;
  name: string;
  code: string; // e.g., "CSE", "ENG", "MECH"
  description: string;
  headId?: string; // Department Head user ID
  headName?: string;
  headEmail?: string;
  
  // Department Details
  building?: string;
  floor?: string;
  officeLocation?: string;
  phone?: string;
  email?: string;
  website?: string;
  
  // Statistics
  totalStaff: number;
  totalStudents: number;
  activeCourses: number;
  
  // Status
  status: DepartmentStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  
  // Settings
  allowStudentEnrollment: boolean;
  requireDepartmentHeadApproval: boolean;
  departmentBudget?: number;
}

export interface DepartmentMember {
  id: string;
  departmentId: string;
  userId: string;
  name: string;
  email: string;
  role: DepartmentRole;
  joinedAt: Date;
  status: 'active' | 'inactive';
}

export interface DepartmentCourse {
  id: string;
  departmentId: string;
  courseCode: string;
  courseName: string;
  instructorId: string;
  instructorName: string;
  semester: string;
  enrolledStudents: number;
  maxCapacity: number;
  status: 'active' | 'completed' | 'planned';
  createdAt: Date;
}

export interface DepartmentStats {
  departmentId: string;
  totalMembers: number;
  staffCount: number;
  studentCount: number;
  courseCount: number;
  averageClassSize: number;
  departmentHeadName?: string;
  lastUpdated: Date;
}

/**
 * Predefined departments for Indian universities
 */
export const COMMON_DEPARTMENTS = [
  { name: 'Computer Science & Engineering', code: 'CSE', description: 'Computer Science and Software Engineering' },
  { name: 'Electronics & Communication', code: 'ECE', description: 'Electronics and Communication Engineering' },
  { name: 'Mechanical Engineering', code: 'MECH', description: 'Mechanical Engineering' },
  { name: 'Civil Engineering', code: 'CIVIL', description: 'Civil Engineering' },
  { name: 'Electrical Engineering', code: 'EEE', description: 'Electrical and Electronics Engineering' },
  { name: 'Chemical Engineering', code: 'CHEM', description: 'Chemical Engineering' },
  { name: 'Biotechnology', code: 'BIO', description: 'Biotechnology and Life Sciences' },
  { name: 'Physics', code: 'PHYS', description: 'Department of Physics' },
  { name: 'Chemistry', code: 'CHEM', description: 'Department of Chemistry' },
  { name: 'Mathematics', code: 'MATH', description: 'Department of Mathematics' },
  { name: 'Business Administration', code: 'MBA', description: 'Master of Business Administration' },
  { name: 'Commerce', code: 'COM', description: 'Department of Commerce' },
  { name: 'Economics', code: 'ECON', description: 'Department of Economics' },
  { name: 'English', code: 'ENG', description: 'Department of English' },
  { name: 'History', code: 'HIST', description: 'Department of History' },
  { name: 'Political Science', code: 'POLS', description: 'Department of Political Science' },
  { name: 'Psychology', code: 'PSY', description: 'Department of Psychology' },
  { name: 'Sociology', code: 'SOC', description: 'Department of Sociology' },
  { name: 'Law', code: 'LAW', description: 'Faculty of Law' },
  { name: 'Medicine', code: 'MED', description: 'Faculty of Medicine' },
];

/**
 * Create a new department
 */
export function createDepartment(
  universityId: string,
  name: string,
  code: string,
  description: string,
  createdBy: string
): Department {
  return {
    id: `dept_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    universityId,
    name,
    code,
    description,
    status: 'active',
    totalStaff: 0,
    totalStudents: 0,
    activeCourses: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy,
    allowStudentEnrollment: true,
    requireDepartmentHeadApproval: false,
  };
}

/**
 * Add a member to a department
 */
export function addDepartmentMember(
  departmentId: string,
  userId: string,
  name: string,
  email: string,
  role: DepartmentRole
): DepartmentMember {
  return {
    id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    departmentId,
    userId,
    name,
    email,
    role,
    joinedAt: new Date(),
    status: 'active',
  };
}

/**
 * Assign department head
 */
export function assignDepartmentHead(
  department: Department,
  headId: string,
  headName: string,
  headEmail: string
): Department {
  return {
    ...department,
    headId,
    headName,
    headEmail,
    updatedAt: new Date(),
  };
}

/**
 * Update department details
 */
export function updateDepartment(
  department: Department,
  updates: Partial<Department>
): Department {
  return {
    ...department,
    ...updates,
    updatedAt: new Date(),
  };
}

/**
 * Calculate department statistics
 */
export function calculateDepartmentStats(
  department: Department,
  members: DepartmentMember[],
  courses: DepartmentCourse[]
): DepartmentStats {
  const staffCount = members.filter(m => m.role !== 'student').length;
  const studentCount = members.filter(m => m.role === 'student').length;
  const totalEnrolled = courses.reduce((sum, course) => sum + course.enrolledStudents, 0);
  const avgClassSize = courses.length > 0 ? Math.round(totalEnrolled / courses.length) : 0;

  return {
    departmentId: department.id,
    totalMembers: members.length,
    staffCount,
    studentCount,
    courseCount: courses.length,
    averageClassSize: avgClassSize,
    departmentHeadName: department.headName,
    lastUpdated: new Date(),
  };
}

/**
 * Get department by code
 */
export function getDepartmentByCode(departments: Department[], code: string): Department | undefined {
  return departments.find(d => d.code.toUpperCase() === code.toUpperCase());
}

/**
 * Filter departments by status
 */
export function filterDepartmentsByStatus(
  departments: Department[],
  status: DepartmentStatus
): Department[] {
  return departments.filter(d => d.status === status);
}

/**
 * Search departments
 */
export function searchDepartments(
  departments: Department[],
  query: string
): Department[] {
  const lowerQuery = query.toLowerCase();
  return departments.filter(d =>
    d.name.toLowerCase().includes(lowerQuery) ||
    d.code.toLowerCase().includes(lowerQuery) ||
    d.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get department members by role
 */
export function getDepartmentMembersByRole(
  members: DepartmentMember[],
  role: DepartmentRole
): DepartmentMember[] {
  return members.filter(m => m.role === role);
}

/**
 * Get department head
 */
export function getDepartmentHead(members: DepartmentMember[]): DepartmentMember | undefined {
  return members.find(m => m.role === 'department_head');
}

/**
 * Validate department code (must be unique)
 */
export function isValidDepartmentCode(
  code: string,
  existingDepartments: Department[]
): boolean {
  if (!code || code.length === 0 || code.length > 10) return false;
  const exists = existingDepartments.some(d => d.code.toUpperCase() === code.toUpperCase());
  return !exists;
}

/**
 * Get department hierarchy
 */
export interface DepartmentHierarchy {
  department: Department;
  head?: DepartmentMember;
  admins: DepartmentMember[];
  staff: DepartmentMember[];
  students: DepartmentMember[];
}

export function buildDepartmentHierarchy(
  department: Department,
  members: DepartmentMember[]
): DepartmentHierarchy {
  const head = members.find(m => m.role === 'department_head');
  const admins = members.filter(m => m.role === 'department_admin');
  const staff = members.filter(m => m.role === 'staff');
  const students = members.filter(m => m.role === 'student');

  return {
    department,
    head,
    admins,
    staff,
    students,
  };
}
