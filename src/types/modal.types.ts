import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

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