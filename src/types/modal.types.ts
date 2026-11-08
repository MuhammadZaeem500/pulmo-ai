import { ReactNode } from "react";
import { SecurityAlert, User } from "@/types/admin.types";

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export interface EditNoteModalProps extends BaseModalProps {
  onSave: (savedNote: any) => void;
  noteToEdit?: any | null;
}

export interface ActionModalProps extends BaseModalProps {
  onSave: () => void;
}

export interface AddMedicalRecordModalProps extends BaseModalProps {
  onSave: (newRecord: any) => void;
}

export interface ConsultationNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (savedNote: any) => void;
  noteToEdit?: any | null;
}

export interface SecurityAlertModalProps {
  alert: SecurityAlert | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (alertId: number) => void;
}

export interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleSuspend: (userId: number) => void;
}
