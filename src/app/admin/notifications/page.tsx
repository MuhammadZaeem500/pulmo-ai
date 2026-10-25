// src/app/admin/notifications/page.tsx
"use client";

import React, { useState } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import { 
  Building2, 
  ShieldAlert, 
  Settings, 
  Info, 
  Check, 
  X, 
  CheckCheck 
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "Verification" | "Security" | "System" | "Update";
  isRead: boolean;
  isUrgent?: boolean;
  icon: any;
  badgeBg: string;
  borderColor?: string;
}

export default function AdminNotificationsPage() {
  const [activeTab, setActiveTab] = useState<"All" | "Verification" | "Security" | "System" | "Update">("All");

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Clinic verification request",
      description: "Breathe Well Clinic (Austin, TX) submitted a verification request. Review the application to approve or reject.",
      time: "10 min ago",
      type: "Verification",
      isRead: false,
      isUrgent: true,
      icon: Building2,
      badgeBg: "bg-blue-50 text-blue-600",
      borderColor: "border-l-4 border-l-blue-500"
    },
    {
      id: "2",
      title: "Critical security alert",
      description: "Multiple failed login attempts from IP 192.168.1.47. The account has been automatically locked.",
      time: "34 min ago",
      type: "Security",
      isRead: false,
      isUrgent: true,
      icon: ShieldAlert,
      badgeBg: "bg-rose-50 text-rose-600",
      borderColor: "border-l-4 border-l-rose-500"
    },
    {
      id: "3",
      title: "Sunrise Medical Center pending",
      description: "Sunrise Medical Center (Miami, FL) has been awaiting verification for 3 days. Action required.",
      time: "1 hr ago",
      type: "Verification",
      isRead: false,
      isUrgent: true,
      icon: Building2,
      badgeBg: "bg-blue-50 text-blue-600",
      borderColor: "border-l-4 border-l-blue-500"
    },
    {
      id: "4",
      title: "System maintenance scheduled",
      description: "PulmoAI platform will undergo scheduled maintenance on June 15, 2026 from 2:00–4:00 AM UTC.",
      time: "5 hr ago",
      type: "System",
      isRead: true,
      icon: Settings,
      badgeBg: "bg-purple-50 text-purple-600"
    },
    {
      id: "5",
      title: "Admin role updated",
      description: "User Dr. Emily Watson has been granted Clinic Manager privileges by Super Admin.",
      time: "Yesterday",
      type: "Update",
      isRead: true,
      icon: Info,
      badgeBg: "bg-teal-50 text-teal-600"
    },
    {
      id: "6",
      title: "Fake review cluster removed",
      description: "14 suspicious reviews for Metro Clinic have been removed following automated detection.",
      time: "Yesterday",
      type: "Security",
      isRead: true,
      icon: ShieldAlert,
      badgeBg: "bg-rose-50 text-rose-600"
    },
    {
      id: "7",
      title: "Monthly analytics report ready",
      description: "The May 2026 healthcare analytics report has been generated and is ready for download.",
      time: "Jun 10, 2026",
      type: "System",
      isRead: true,
      icon: Settings,
      badgeBg: "bg-purple-50 text-purple-600"
    },
    {
      id: "8",
      title: "New admin registered",
      description: "Dr. Robert Tanner has completed registration as a Support Admin. Account is pending super admin approval.",
      time: "Jun 9, 2026",
      type: "Update",
      isRead: true,
      icon: Info,
      badgeBg: "bg-teal-50 text-teal-600"
    },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true, isUrgent: false, borderColor: undefined })));
  };

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true, isUrgent: false, borderColor: undefined } : n));
  };

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "All") return true;
    return n.type === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Mark All Read */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
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

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/80 w-fit shadow-xs overflow-x-auto">
        {(["All", "Verification", "Security", "System", "Update"] as const).map((tab) => {
          const count = tab === "All" ? notifications.length : notifications.filter(n => n.type === tab).length;
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
              {tab !== "All" && (
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                  activeTab === tab ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notifications List using Reusable DashboardCard */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => {
            const NotifIcon = notif.icon;
            return (
              <DashboardCard 
                key={notif.id}
                className={`transition-all hover:shadow-md ${notif.borderColor || ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Icon Box */}
                    <div className={`w-10 h-10 rounded-xl ${notif.badgeBg} flex items-center justify-center shrink-0 mt-0.5 shadow-xs`}>
                      <NotifIcon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900">{notif.title}</h3>
                        
                        {/* Unread / Urgent Indicator Dot */}
                        {notif.isUrgent && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        )}

                        {/* Type Badge */}
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${notif.badgeBg}`}>
                          {notif.type}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{notif.description}</p>
                      <span className="text-[11px] text-slate-400 font-medium block pt-0.5">{notif.time}</span>
                    </div>
                  </div>

                  {/* Actions (Mark Read & Dismiss) */}
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
