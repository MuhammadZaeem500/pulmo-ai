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
  X
} from "lucide-react";
import  SidebarProps  from "@/types/patient.types";


export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

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
     
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

     
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#2F80ED] to-[#14B8A6] flex flex-col h-screen shrink-0 transition-transform duration-300 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-white">PulmoAI</span>
          </div>
         
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      router.push(item.path);
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white/20 backdrop-blur-sm text-white shadow-lg font-medium'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}