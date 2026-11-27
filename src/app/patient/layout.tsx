"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/patient/PatientSidebar";
import { Menu, Bell, Loader2, CheckCheck } from "lucide-react";
import api from "@/services/api";
import { settingsService } from "@/services/settings.service";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PatientNotification {
  id: string;
  title: string;
  message?: string;
  read: boolean;
  createdAt?: string;
}

function normalizeNotifications(payload: any): PatientNotification[] {
  const raw = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.notifications)
      ? payload.notifications
      : Array.isArray(payload?.data?.notifications)
        ? payload.data.notifications
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

  return raw.map((item: any, idx: number) => ({
    id: String(item?.id ?? idx),
    title: item?.title || item?.message || "Notification",
    message: item?.title ? item?.message : undefined,
    read: Boolean(item?.read ?? item?.isRead ?? false),
    createdAt: item?.createdAt || item?.timestamp,
  }));
}

function formatTimeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const time = new Date(dateStr).getTime();
  if (Number.isNaN(time)) return "";
  const diffSec = Math.max(0, Math.floor((Date.now() - time) / 1000));
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const { setLanguage, setTimeZone, t } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [patientInitials, setPatientInitials] = useState("PT");
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [notifications, setNotifications] = useState<PatientNotification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);

  const loadNotifications = useCallback(async () => {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (!token) return;

    setNotifLoading(true);
    try {
      const res = await api.get("/patient/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(normalizeNotifications(res?.data));
    } catch {
      // Keep existing notifications if endpoint isn't available yet
    } finally {
      setNotifLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const token =
        localStorage.getItem("accessToken") || localStorage.getItem("token");

      if (!token) {
        router.replace("/auth/patient/sign-in");
        return;
      }

      try {
        const response = await api.get("/patient/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!isMounted) return;

        setIsAuthorized(true);
        const data = response?.data?.data || response?.data;
        const fullName = data?.patientProfile?.fullName || data?.fullName;

        if (fullName) {
          const initials = fullName
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
          setPatientInitials(initials || "PT");
        }

        loadNotifications();
        settingsService
          .getPreferences()
          .then((prefs) => {
            if (prefs?.darkMode !== undefined) {
              setTheme(prefs.darkMode ? "dark" : "light");
            }
            if (prefs?.language) setLanguage(prefs.language);
            if (prefs?.timeZone) setTimeZone(prefs.timeZone);
          })
          .catch(() => {});
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("token");
          router.replace("/auth/patient/sign-in");
          return;
        }
        console.error("Failed to load patient profile initials", err);
        if (isMounted) setIsAuthorized(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [router, loadNotifications]);

  useEffect(() => {
    if (!isAuthorized) return;
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAuthorized, loadNotifications]);

  useEffect(() => {
    if (!notifOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );

    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    try {
      await api.patch(
        `/patient/notifications/${id}/read`,
        {},
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
    } catch {
      // Optimistic update already applied
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));

    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    try {
      await api.patch(
        "/patient/notifications/read-all",
        {},
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
    } catch {
      // Optimistic update already applied
    }
  };

  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <p className="text-xs font-semibold text-slate-500">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-['Ubuntu',sans-serif]">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

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
              {t("patientPortal", "Patient Portal")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div ref={notifRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  const nextOpen = !notifOpen;
                  setNotifOpen(nextOpen);
                  if (nextOpen) loadNotifications();
                }}
                aria-label="Notifications"
                className="relative p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600">
                          {unreadCount} unread
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllAsRead}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifLoading && notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-500">
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-500">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => !item.read && handleMarkAsRead(item.id)}
                          className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 cursor-pointer ${
                            !item.read ? "bg-blue-50/40" : "bg-white"
                          }`}
                        >
                          <span
                            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                              !item.read ? "bg-rose-500" : "bg-transparent"
                            }`}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-2">
                              <p className="truncate text-xs font-semibold text-slate-900">
                                {item.title}
                              </p>
                              {item.createdAt && (
                                <span className="shrink-0 text-[11px] text-slate-400">
                                  {formatTimeAgo(item.createdAt)}
                                </span>
                              )}
                            </div>
                            {item.message && (
                              <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">
                                {item.message}
                              </p>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                patientInitials
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#F8FAFC]">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
