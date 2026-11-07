// src/types/common.types.ts
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export interface ChatHistoryItemProps {
  title: string;
  date: string;
  isActive?: boolean;
  onClick: () => void;
}

export interface AvailableDoctorCardProps {
  name: string;
  specialty: string;
  nextAvailable: string;
  onBook: () => void;
}

export interface DashboardCardProps {
  title?: string;
  icon?: LucideIcon | ReactNode;
  iconGradient?: boolean;
  viewAllLink?: string;
  actionText?: string;
  onAction?: () => void;
  children: ReactNode;
  className?: string;
}

export interface DoctorClinicCardProps {
  icon?: LucideIcon | ReactNode;
  title: string;
  subtitle: string;
  metaText: string;
  rating: string;
  availability?: string;
  actionText?: string;
  onActionClick?: () => void;
}

export interface FeatureCardProps {
  icon: LucideIcon | ReactNode;
  title: string;
  description: string;
  badge?: string;
  isPopular?: boolean;
  linkText?: string;
  stepNumber?: string;
}

export interface MedicalRecordCardProps {
  date: string;
  diagnosis: string;
  symptoms: string;
  confidence: string;
  urgency: string;
  recommendations: string;
  onViewDetails?: () => void;
  onDownloadReport?: () => void;
}

export interface MedicineColorCardProps {
  label: string;
  colorBg?: string;
  icon?: LucideIcon | ReactNode;
  isSelected?: boolean;
  onClick: () => void;
}

export interface MedicineShapeCardProps {
  label: string;
  icon: LucideIcon | ReactNode;
  isSelected?: boolean;
  onClick: () => void;
}

export interface MetricCardProps {
  title?: string;
  value?: string | number;
  trend?: string;
  trendColor?: string;
  icon?: LucideIcon;
  iconBgColor?: string;
  valueColor?: string;
  className?: string;
}

export interface PrescriptionCardProps {
  medicine: string;
  doctor: string;
  date: string;
  dosage: string;
  duration: string;
  onDownload?: () => void;
  onViewFull?: () => void;
}

export interface PreviousAppointmentCardProps {
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  clinic: string;
  status: string;
  notes: string;
  onChat: () => void;
}

export interface ProfileFieldProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export interface ProfilePrescriptionItemProps {
  medicine: string;
  prescribedDate: string;
  status: string;
}

export interface SettingSectionCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}

export interface SettingToggleItemProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

export interface SymptomCardProps {
  symptom: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  date: string;
  trendIcon: 'right' | 'down' | 'up';
  onViewHistory?: () => void;
}

export default interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatarInitial: string;
}