export interface SigninFormData {
    email: string;
    password: string; }


export interface SignupFormData {
    firstname: string;
    lastname: string;
    companyname: string;
    industry: string;
    email: string;
    role: string;
    password: string;
    confirmpassword: string; }


export interface CompleteProfileFormData {
    firstname: string;
    lastname: string;
    companyname: string;
    industry: string;
    address: string;
    role: string;
    password: string;
    website: string;
    linkedin: string;
    github: string;
    confirmpassword: string;
    profile: Blob | null }


export interface PostInternshipFormData {
    title: string;
    companyId: string;
    description: string;
    responsibilities: string;
    requirements: string;
    benefits: string;
    type: string;
    duration: string;
    deadline: string; }


export interface UpdateProfileFormData {
    firstname: string;
    lastname: string;
    companyname: string;
    industry: string;
    address: string;
    role: string;
    password: string;
    website: string;
    linkedin: string;
    github: string;
    about: string;
    university: string;
    course: string;
    level: string;
    specialty: string;
    confirmpassword: string;
    profile: Blob | null }


export interface PasswordResetFormData {
    password: string;
    confirmpassword: string; }

export interface User { 
    id: string;
    firstname?: string;
    lastname?: string;
    companyId?: string;
    studentId?: string;
    userId?: string;
    companyname?: string;
    industry?: string;
    selected?: boolean;
    email: string;
    address: string;
    role: string;
    profileUrl: string;
    isNewUser: boolean;
    website: string;
    linkedin: string;
    github: string;
    about: string;
    specialty: string;
    course: string;
    university: string;
    level: string;
    resumeId: string;
    resumeUrl: string; }

export interface SigninReturnType { 
    isAuthLoading?: boolean;
    message?: string;
    token: string | null;
    user: User | null }


export interface ToastProps {
    message: string | null;
    isError: boolean;
    timeout: number; }

export interface Internship {
    id: string;
    companyId: string;
    title: string;
    description: string;
    type: string;
    industry: string;
    duration: string;
    deadline: string;
    responsibilities: string;
    requirements: string;
    benefits: string;
    address: string;
    profileUrl: string;
    companyname: string;
    shortlisted: boolean;
    company: User }


export interface Applications {
    id: string;
    studentId: string;
    internshipId: string;
    student: User;
    internship: Internship; }