export interface Clinic {
  id: number;
  name: string;
  phone: string;
  location: string;
  status: "Verified" | "Pending" | "Suspended";
  specialists: number;
  type: string;
  since: string;
}

export default interface DoctorRequest {
  userId: string;
  email: string;
  createdAt: string;
  profile?: {
    fullName: string;
    licenseNumber: string;
    specialization: string;
  };
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "Verification" | "Security" | "System" | "Update";
  isRead: boolean;
  isUrgent?: boolean;
  icon: any;
  badgeBg: string;
  borderColor?: string;
}

export interface ReportItem {
  id: string;
  title: string;
  description: string;
  lastDate: string;
  fileSize: string;
  status: string;
  icon: any;
  buttonBg: string;
  buttonText: string;
}

export interface RecentDownload {
  id: string;
  title: string;
  date: string;
  format: "PDF" | "CSV" | "XLSX";
}

export interface SecurityAlert {
  id: number;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "Investigating" | "Resolved";
  description: string;
  date: string;
  icon: any;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  registered: string;
  lastLogin: string;
  status: "Active" | "Pending" | "Suspended";
  avatarBg: string;
  initials: string;
}

export interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export interface AddClinicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClinic: (clinic: {
    name: string;
    location: string;
    phone: string;
    specialists: number;
    type: string;
  }) => void;
}

export interface SecurityAlert {
  id: number;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "Investigating" | "Resolved";
  description: string;
  date: string;
  icon: any;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  registered: string;
  lastLogin: string;
  status: "Active" | "Pending" | "Suspended";
  avatarBg: string;
  initials: string;
}

