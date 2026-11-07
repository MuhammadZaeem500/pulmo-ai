export interface ItemData {
  id: number;
  title: string;
  subtitle: string;
  metaText: string;
  rating: string;
  actionText: string;
  availability?: string;
}

export default interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}