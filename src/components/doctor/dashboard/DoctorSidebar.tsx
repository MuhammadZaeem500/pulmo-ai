// src/components/doctor/dashboard/DoctorSidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Pill, 
  TestTube, 
  Calendar, 
  User, 
  Settings, 
  LogOut, 
  Stethoscope 
} from "lucide-react";

export default function DoctorSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
    { name: "Patients", href: "/doctor/patients", icon: Users },
    { name: "Consultation Notes", href: "/doctor/notes", icon: FileText },
    { name: "Prescriptions", href: "/doctor/prescriptions", icon: Pill },
    { name: "Recommended Tests", href: "/doctor/tests", icon: TestTube },
    { name: "Appointments", href: "/doctor/appointments", icon: Calendar },
  ];

  const bottomNavItems = [
    { name: "Profile", href: "/doctor/profile", icon: User },
    { name: "Settings", href: "/doctor/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200/80 flex flex-col justify-between p-6 select-none shrink-0">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">PulmoAI</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Doctor Portal</span>
          </div>
        </div>

        {/* Doctor Info Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
            SM
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-800 truncate">Dr. Sarah Mitchell</h4>
            <p className="text-[11px] text-slate-400 truncate">Pulmonologist</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100/60 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile, Settings & Logout */}
      <div className="space-y-1 pt-4 border-t border-slate-200/60">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-100/60 hover:text-slate-900"
              }`}
            >
              <Icon className="w-4 h-4 text-slate-400" />
              {item.name}
            </Link>
          );
        })}

        <button
          onClick={() => alert("Logged out successfully")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
