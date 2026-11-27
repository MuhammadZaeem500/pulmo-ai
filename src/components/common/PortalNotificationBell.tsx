"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Loader2, Trash2 } from "lucide-react";
import api from "@/services/api";

export interface PortalNotification {
  id: string;
  title: string;
  message?: string;
  read: boolean;
  createdAt?: string;
}

function normalizeNotifications(payload: any): PortalNotification[] {
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
    message: item?.title ? item?.message || item?.description || item?.body : undefined,
    read: Boolean(item?.read ?? item?.isRead ?? false),
    createdAt: item?.createdAt || item?.timestamp || item?.time,
  }));
}

function formatTimeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const time = new Date(dateStr).getTime();
  if (Number.isNaN(time)) return dateStr;
  const diffSec = Math.max(0, Math.floor((Date.now() - time) / 1000));
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

interface PortalNotificationBellProps {
  baseUrl: string;
  viewAllHref?: string;
}

export default function PortalNotificationBell({
  baseUrl,
  viewAllHref,
}: PortalNotificationBellProps) {
  const [notifications, setNotifications] = useState<PortalNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(baseUrl);
      setNotifications(normalizeNotifications(res?.data));
    } catch {
      // Keep existing notifications on transient error
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
    try {
      await api.patch(`${baseUrl}/${id}/read`);
    } catch {
      // Optimistic update applied
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    try {
      await api.patch(`${baseUrl}/read-all`);
    } catch {
      // Optimistic update applied
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    try {
      await api.delete(`${baseUrl}/${id}`);
    } catch {
      // Optimistic update applied
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) loadNotifications();
        }}
        aria-label="Notifications"
        className="relative p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Notifications</span>
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
            {loading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-slate-500">
                No notifications yet.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!item.read) handleMarkAsRead(item.id);
                  }}
                  className={`group flex items-start gap-2.5 px-4 py-3 transition-colors cursor-pointer ${
                    item.read ? "bg-white hover:bg-slate-50" : "bg-blue-50/40 hover:bg-blue-50/70"
                  }`}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      item.read ? "bg-transparent" : "bg-blue-600"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                    {item.message && (
                      <p className="mt-0.5 text-[11px] text-slate-600 line-clamp-2">
                        {item.message}
                      </p>
                    )}
                    {item.createdAt && (
                      <p className="mt-1 text-[10px] font-medium text-slate-400">
                        {formatTimeAgo(item.createdAt)}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    aria-label="Delete notification"
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {viewAllHref && (
            <div className="border-t border-slate-100 px-4 py-2.5 text-center bg-slate-50/50">
              <Link
                href={viewAllHref}
                onClick={() => setOpen(false)}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
