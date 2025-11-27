export type UserRole = 'applicant' | 'company';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface ApplicantProfile extends User {
  role: 'applicant';
  title: string;
  skills: string[];
  experience: string;
  education: string;
  location: string;
  phone: string;
  resume?: string;
}

export interface CompanyProfile extends User {
  role: 'company';
  companyName: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  description: string;
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  requirements: string[];
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  location: string;
  salary: string;
  experience: string;
  postedDate: string;
  category: string;
}

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantTitle: string;
  coverLetter: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedDate: string;
}
