"use client";

import React, { useState, useEffect } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import { 
  Building2, 
  ShieldAlert, 
  Settings, 
  Info, 
  Check, 
  X, 
  CheckCheck,
  Loader2,
  MailOpen
} from "lucide-react";
import { Notification } from "@/types/admin.types";
import api from "@/services/api";

export default function AdminNotificationsPage() {
  const [activeTab, setActiveTab] = useState<"All" | "Unread" | "Read" | "Verification" | "Security" | "System" | "Update">("All");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNotifications() {
      try {
        setLoading(true);
        const res = await api.get('/admin/notifications');
        const data = res.data.notifications || res.data;

        const mapped = data.map((item: any) => {
          let icon = Info;
          let badgeBg = "bg-teal-50 text-teal-600";
          let borderColor = "";

          if (item.type === "Verification") {
            icon = Building2;
            badgeBg = "bg-blue-50 text-blue-600";
            borderColor = "border-l-4 border-l-blue-500";
          } else if (item.type === "Security") {
            icon = ShieldAlert;
            badgeBg = "bg-rose-50 text-rose-600";
            borderColor = "border-l-4 border-l-rose-500";
          } else if (item.type === "System") {
            icon = Settings;
            badgeBg = "bg-purple-50 text-purple-600";
          }

          return {
            ...item,
            icon,
            badgeBg,
            borderColor: item.isRead ? "" : borderColor,
          };
        });

        setNotifications(mapped);
      } catch (err: any) {
        setError(err.message || "Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const readCount = notifications.filter(n => n.isRead).length;

const handleMarkAllRead = async () => {
    try {
      await api.patch('/admin/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true, isUrgent: false, borderColor: undefined })));
    } catch (err) {
      console.error("Failed to mark all read", err);
    }
  };

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.patch(`/admin/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true, isUrgent: false, borderColor: undefined } : n));
    } catch (err) {
      console.error("Failed to mark notification read", err);
    }
  };

const handleDismiss = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/admin/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id)); // Changed .map to .filter
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "All") return true;
    if (activeTab === "Unread") return !n.isRead;
    if (activeTab === "Read") return n.isRead;
    return n.type === activeTab;
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl text-sm font-medium">
        Error loading notifications: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            You have {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}.
          </p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer w-fit"
        >
          <CheckCheck className="w-4 h-4 text-teal-600" /> Mark all read
        </button>
      </div>

      {/* Navigation Tabs including All and Unread */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/80 w-fit shadow-xs overflow-x-auto">
        {(["All", "Unread", "Read", "Verification", "Security", "System", "Update"] as const).map((tab) => {
          let count = notifications.length;
          if (tab === "Unread") count = unreadCount;
          else if (tab === "Read") count = readCount;
          else if (tab !== "All") count = notifications.filter(n => n.type === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{tab}</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                activeTab === tab ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notifications Feed */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => {
            const NotifIcon = notif.icon || Info;
            return (
              <DashboardCard 
                key={notif.id}
                className={`transition-all hover:shadow-md ${notif.borderColor || ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${notif.badgeBg || "bg-slate-100 text-slate-600"} flex items-center justify-center shrink-0 mt-0.5 shadow-xs`}>
                      <NotifIcon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900">{notif.title}</h3>
                        
                        {notif.isUrgent && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        )}

                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${notif.badgeBg || "bg-slate-100 text-slate-600"}`}>
                          {notif.type}
                        </span>

                        {notif.isRead && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-500 flex items-center gap-1">
                            <MailOpen className="w-3 h-3" /> Read
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{notif.description}</p>
                      <span className="text-[11px] text-slate-400 font-medium block pt-0.5">{notif.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!notif.isRead && (
                      <button
                        onClick={(e) => handleMarkAsRead(notif.id, e)}
                        className="p-2 rounded-xl text-slate-400 hover:text-teal-600 hover:bg-slate-50 transition-colors cursor-pointer"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDismiss(notif.id, e)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-colors cursor-pointer"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </DashboardCard>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400 text-xs font-semibold">
            No notifications found in this category.
          </div>
        )}
      </div>
    </div>
  );
}