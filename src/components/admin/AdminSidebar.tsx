"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
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
  ChevronRight,
  X,
  Stethoscope
} from "lucide-react";
import  {AdminSidebarProps}  from "@/types/admin.types";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function AdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarWidth } = useTheme();
  const { t } = useLocale();
  const expandedWidthClass =
    sidebarWidth === "Compact"
      ? "lg:w-56"
      : sidebarWidth === "Wide"
        ? "lg:w-72"
        : "lg:w-64";

  const handleLogout = async () => {
    setMobileOpen(false);
    await authService.logout();
    router.push("/auth/admin/sign-in");
  };

  const navItems = [
    { label: t("dashboard", "Dashboard"), href: "/admin/dashboard", icon: LayoutDashboard },
    { label: t("clinicsHospitals", "Clinics & Hospitals"), href: "/admin/clinics", icon: Building2 },
    { label: t("doctorVerification", "Doctor Verification"), href: "/admin/doctor-verification", icon: Stethoscope },
    { label: t("users", "Users"), href: "/admin/users", icon: Users },
    { label: t("healthcareAnalytics", "Healthcare Analytics"), href: "/admin/analytics", icon: BarChart3 },
    { label: t("securityCenter", "Security Center"), href: "/admin/security", icon: ShieldCheck },
    { label: t("reports", "Reports"), href: "/admin/reports", icon: FileText },
    { label: t("notifications", "Notifications"), href: "/admin/notifications", icon: Bell },
    { label: t("settings", "Settings"), href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
     
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

     
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 select-none shrink-0 ${
          mobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-20" : expandedWidthClass}`}
      >
        <div>
         
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Activity className="w-5 h-5" />
              </div>
              {(!collapsed || mobileOpen) && (
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  PulmoAI
                </span>
              )}
            </div>
           
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

         
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  {(!collapsed || mobileOpen) && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

       
        <div className="p-3 border-t border-slate-100 space-y-1">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!collapsed || mobileOpen) && <span>Logout</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4 shrink-0" /> : <ChevronLeft className="w-4 h-4 shrink-0" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}