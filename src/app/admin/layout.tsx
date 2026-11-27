"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Menu } from "lucide-react";
import PortalNotificationBell from "@/components/common/PortalNotificationBell";
import api from "@/services/api";
import { useTheme, type AppTheme, type SidebarWidthMode } from "@/components/providers/ThemeProvider";
import { useLocale, type AppDateFormat } from "@/components/providers/LocaleProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setTheme, setSidebarWidth } = useTheme();
  const { setLanguage, setTimeZone, setDateFormat, t } = useLocale();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check for token existence in localStorage (or cookies if syncing)
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/admin/sign-in");
    } else {
      setIsAuthorized(true);
      api
        .get("/admin/settings")
        .then((res) => {
          const s = res?.data?.settings || res?.data;
          if (s?.theme) setTheme(s.theme as AppTheme);
          if (s?.sidebarWidth) setSidebarWidth(s.sidebarWidth as SidebarWidthMode);
          if (s?.language) setLanguage(s.language);
          if (s?.timeZone) setTimeZone(s.timeZone);
          if (s?.dateFormat) setDateFormat(s.dateFormat as AppDateFormat);
        })
        .catch(() => {});
    }
  }, [router, setTheme, setSidebarWidth]);

  // Prevent flashing protected content before redirect completes
  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">

      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden w-full">

        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500">
              <span>Admin</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900">Dashboard</span>
            </div>
            <span className="sm:hidden font-extrabold text-slate-900 text-sm tracking-tight">
              {t("adminPortal", "PulmoAI Admin")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <PortalNotificationBell
              baseUrl="/admin/notifications"
              viewAllHref="/admin/notifications"
            />
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

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#F8FAFC]">
          <div className="mx-auto space-y-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}