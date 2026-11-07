export interface AuthStepperProps {
  currentStep: number;
}

export interface DoctorSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}