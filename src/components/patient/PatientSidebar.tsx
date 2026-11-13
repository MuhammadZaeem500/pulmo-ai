"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  FileText,
  Activity,
  Pill,
  Search,
  MapPin,
  Calendar,
  User,
  Settings as SettingsIcon,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import SidebarProps from "@/types/patient.types";
import { useState } from "react";

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/patient/dashboard' },
    { icon: MessageCircle, label: 'Chatbot', path: '/patient/chatbot' },
    { icon: FileText, label: 'Medical History', path: '/patient/medical-history' },
    { icon: Activity, label: 'Symptom Tracker', path: '/patient/symptom-tracker' },
    { icon: Pill, label: 'Prescriptions', path: '/patient/prescriptions' },
    { icon: Search, label: 'Know Your Medicine', path: '/patient/know-your-medicine' },
    { icon: MapPin, label: 'Clinics & Specialists', path: '/patient/clinics-specialists' },
    { icon: Calendar, label: 'Appointments', path: '/patient/appointments' },
    { icon: User, label: 'Profile', path: '/patient/profile' },
    { icon: SettingsIcon, label: 'Settings', path: '/patient/settings' },
  ];

  const handleLogout = () => {
    router.push('/auth/patient/sign-in');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 ${
        isCollapsed ? 'lg:w-20' : 'lg:w-64'
      } w-64 bg-linear-to-b from-[#2F80ED] to-[#14B8A6] flex flex-col h-screen shrink-0 transition-all duration-300 ${
        mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
      }`}>
        {/* Header (Logo + Mobile Close Cross Button) */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-lg text-white truncate">PulmoAI</span>
            )}
          </div>
         
          {/* Cross button for mobile drawer */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 sm:p-4 overflow-y-auto overflow-x-hidden">
          <ul className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      router.push(item.path);
                      setMobileOpen(false);
                    }}
                    title={isCollapsed ? item.label : ""}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white/20 backdrop-blur-sm text-white shadow-md font-medium'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="text-xs sm:text-sm truncate">{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Actions (Logout & Desktop Collapse Toggle) */}
        <div className="p-3 sm:p-4 border-t border-white/10 space-y-2">
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : ""}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="text-xs sm:text-sm font-medium">Logout</span>}
          </button>

          {/* Collapse Button (Visible on large screens only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className={`w-full hidden lg:flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-start gap-2 px-3.5'} py-2.5 rounded-xl text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer shadow-2xs border border-white/20`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-white" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 text-white" />
                <span className="text-xs sm:text-sm font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}