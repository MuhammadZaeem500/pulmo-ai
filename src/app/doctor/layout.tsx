"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import { Menu, Loader2 } from "lucide-react";
import { doctorPortalService, doctorSettingsService } from "@/services/doctor.service";
import { authService } from "@/services/auth.service";
import PortalNotificationBell from "@/components/common/PortalNotificationBell";
import { useTheme, type AppTheme } from "@/components/providers/ThemeProvider";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const { setLanguage, setTimeZone, t } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [doctorInitials, setDoctorInitials] = useState("DR");
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Check auth token and fetch live doctor profile details on mount
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      if (!token) {
        router.replace("/auth/doctor/sign-in");
        return;
      }
      setIsAuthorized(true);

      try {
        const response = await doctorPortalService.getProfile();
        const profile = response?.data || response;

        // Block unverified doctors from accessing the portal
        if (profile?.verificationStatus && profile.verificationStatus !== 'APPROVED') {
          authService.clearAuthSession();
          router.replace("/auth/doctor/sign-in");
          return;
        }

        if (profile?.initials) {
          setDoctorInitials(profile.initials);
        } else if (profile?.fullName) {
          const initials = profile.fullName
            .replace(/^Dr\.\s*/i, "")
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
          setDoctorInitials(initials || "DR");
        }

        doctorSettingsService
          .getPreferences()
          .then((prefs) => {
            if (prefs?.theme || prefs?.darkMode !== undefined) {
              setTheme((prefs.theme || (prefs.darkMode ? "dark" : "light")) as AppTheme);
            }
            if (prefs?.language) setLanguage(prefs.language);
            if (prefs?.timeZone) setTimeZone(prefs.timeZone);
          })
          .catch(() => {});
      } catch (err) {
        console.error("Failed to load doctor profile initials", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [router, setTheme]);

  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <p className="text-xs font-semibold text-slate-500">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      <DoctorSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col overflow-hidden w-full">
       
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-extrabold text-slate-900 text-sm tracking-tight">
              {t("doctorPortal", "Doctor Portal")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <PortalNotificationBell baseUrl="/doctor/notifications" />
            
            {/* Live Doctor Initials Avatar */}
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                doctorInitials
              )}
            </div>
          </div>
        </header>

       
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 bg-white">
          <div className="mx-auto max-w-7xl space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}