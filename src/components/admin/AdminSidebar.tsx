
// src/components/admin/AdminSidebar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Activity, 
  LayoutDashboard, 
  Building2, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  FileText, 
  Bell, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Clinics & Hospitals", href: "/admin/clinics", icon: Building2 },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Healthcare Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Security Center", href: "/admin/security", icon: ShieldCheck },
    { label: "Reports", href: "/admin/reports", icon: FileText },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200/80 flex flex-col justify-between transition-all duration-300 select-none shrink-0 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div>
        {/* Top Brand Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          {!collapsed && (
            <span className="font-extrabold text-slate-900 tracking-tight text-lg">
              PulmoAI
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions: Logout & Collapse */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        <Link
          href="/admin/signin"
          className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4 shrink-0" /> : <ChevronLeft className="w-4 h-4 shrink-0" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}