// src/components/patient/Sidebar.tsx
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
  LogOut
} from "lucide-react";

export default function Sidebar() {
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
    router.push('/auth/sign-in');
  };

  return (
    <div className="w-64 bg-gradient-to-b from-[#2F80ED] to-[#14B8A6] flex flex-col h-screen shrink-0">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg text-white">PulmoAI</span>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <button
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
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
    </div>
  );
}