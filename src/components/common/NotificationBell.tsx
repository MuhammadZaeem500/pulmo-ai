"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface NotificationItem {
  id: string;
  title: string;
  message?: string;
  read: boolean;
  createdAt?: string;
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    null
  );
}

function normalizeNotifications(payload: any): NotificationItem[] {
  const rawList = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.notifications)
      ? payload.notifications
      : Array.isArray(payload?.data?.notifications)
        ? payload.data.notifications
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

  return rawList.map((item: any, index: number) => ({
    id: String(item?.id ?? index),
    title: item?.title || item?.message || "Notification",
    message: item?.title ? item?.message : undefined,
    read: Boolean(item?.read ?? item?.isRead ?? false),
    createdAt: item?.createdAt || item?.timestamp,
  }));
}

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSeconds < 60) return "Just now";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

interface NotificationBellProps {
  endpoint?: string;
  pollIntervalMs?: number;
}

export default function NotificationBell({
  endpoint = "/patient/notifications",
  pollIntervalMs = 30000,
}: NotificationBellProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();
      setNotifications(normalizeNotifications(data));
    } catch {
      // Keep existing list on transient network errors
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchNotifications();
    if (!pollIntervalMs) return;

    const timer = setInterval(fetchNotifications, pollIntervalMs);
    return () => clearInterval(timer);
  }, [fetchNotifications, pollIntervalMs]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );

    try {
      const token = getAuthToken();
      await fetch(`${API_BASE_URL}${endpoint}/${id}/read`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch {
      // Optimistic state already updated
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));

    try {
      const token = getAuthToken();
      await fetch(`${API_BASE_URL}${endpoint}/read-all`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch {
      // Optimistic state already updated
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Bell Icon Button matching your header style */}
      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          fetchNotifications();
        }}
        aria-label="Notifications"
        className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-600 shadow-xs transition hover:bg-slate-50"
      >
        <Bell className="h-5 w-5 stroke-[2]" />
        {unreadCount > 0 && (
          <span
            aria-label={`${unreadCount} unread notifications`}
            className="absolute top-1.5 right-1.5 h-3 w-3 rounded-full bg-rose-500 ring-2 ring-white"
          />
        )}
      </button>

      {/* Dropdown Popover */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-600">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="px-4 py-6 text-center text-xs text-slate-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-slate-500">
                You&apos;re all caught up! No notifications yet.
              </div>
            ) : (
              notifications.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => !item.read && markAsRead(item.id)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${
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
                          {formatRelativeTime(item.createdAt)}
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
  );
}