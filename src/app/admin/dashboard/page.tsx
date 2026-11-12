"use client";

import React, { useState, useEffect } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import {
  Users,
  Activity,
  Building2,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Send,
  Plus,
  Loader2,
} from "lucide-react";
import api from "@/services/api";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalClinics: 0,
    totalConsultations: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        // 1. Fetch live metrics
        const metricsRes = await api.get("/admin/dashboard/metrics");
        const mData = metricsRes.data?.data || metricsRes.data || metricsRes;
        if (mData) {
          setMetrics({
            totalDoctors: mData.totalDoctors || 0,
            totalPatients: mData.totalPatients || 0,
            totalClinics: mData.totalClinics || 0,
            totalConsultations: mData.totalConsultations || 0,
          });
        }

        // 2. Fetch recent audit logs as live activities
        const auditRes = await api.get("/admin/security/audit-logs");
        const audits = auditRes.data || auditRes;
        if (Array.isArray(audits)) {
          const formattedActivities = audits.slice(0, 6).map((log: any) => ({
            title: log.action.replace(/_/g, " "),
            desc:
              log.metadata?.description ||
              `Activity by ${log.user?.email || "System"}`,
            time: new Date(log.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            icon: CheckCircle2,
            color: "text-blue-600 bg-blue-50",
          }));
          setActivities(formattedActivities);
        }

        // 3. Fetch live notifications
        const notifRes = await api.get("/admin/notifications");
        const notifsData = notifRes.data?.notifications || notifRes.data || [];
        if (Array.isArray(notifsData)) {
          setNotifications(notifsData.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to load live dashboard data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
          Welcome back. Here&apos;s what&apos;s happening on the platform.
        </p>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
              Total Doctors
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">
            {metrics.totalDoctors.toLocaleString()}
          </h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Verified & Active Specialists
          </p>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
              Total Patients
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">
            {metrics.totalPatients.toLocaleString()}
          </h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Registered Accounts
          </p>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
              Verified Clinics
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">
            {metrics.totalClinics.toLocaleString()}
          </h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Partner Facilities
          </p>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
              Consultations
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">
            {metrics.totalConsultations.toLocaleString()}
          </h3>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">
            Platform Activity
          </p>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT ACTIVITIES FROM AUDIT LOGS */}
        <div className="lg:col-span-2">
          <DashboardCard>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Recent Activities & Audit Logs
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                Live Feed
              </span>
            </div>

            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((act, idx) => {
                  const Icon = act.icon;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50/60 border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl shrink-0 ${act.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 capitalize">
                            {act.title.toLowerCase()}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-medium">
                            {act.desc}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400 shrink-0 self-end sm:self-center">
                        {act.time}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No recent activities recorded.
                </div>
              )}
            </div>
          </DashboardCard>
        </div>

        <div className="space-y-6">
          {/* QUICK ACTIONS */}
          <DashboardCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => (window.location.href = "/admin/clinics")}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/80 transition-all text-center flex flex-col items-center justify-center gap-2 group cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  Add Clinic
                </span>
              </button>

              <button
                onClick={() => (window.location.href = "/admin/security")}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/80 transition-all text-center flex flex-col items-center justify-center gap-2 group cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  View Alerts
                </span>
              </button>

              <button
                onClick={() => (window.location.href = "/admin/reports")}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/80 transition-all text-center flex flex-col items-center justify-center gap-2 group cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  Generate Report
                </span>
              </button>

              <button
                onClick={() => (window.location.href = "/admin/notifications")}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/80 transition-all text-center flex flex-col items-center justify-center gap-2 group cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Send className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  Send Notification
                </span>
              </button>
            </div>
          </DashboardCard>

          {/* LIVE NOTIFICATIONS CARD */}
          <DashboardCard>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Notifications
              </h3>
              <a
                href="/admin/notifications"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View all
              </a>
            </div>

            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notif, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50/60 border border-slate-100 flex items-start gap-2.5"
                  >
                    <span
                      className={`w-2 h-2 rounded-full mt-1 shrink-0 ${notif.isRead ? "bg-slate-300" : "bg-blue-500"}`}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 leading-snug">
                        {notif.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                        {notif.description}
                      </p>
                      <span className="text-[9px] text-slate-400 font-semibold block mt-1">
                        {notif.time}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No notifications found.
                </div>
              )}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
