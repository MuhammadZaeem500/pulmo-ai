// src/app/admin/layout.tsx
import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Bell, ShieldCheck } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      {/* Sidebar Component */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>Admin</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900">Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                AD
              </div>
              <div className="hidden sm:block">
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Admin User</h4>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
          <div className="mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}