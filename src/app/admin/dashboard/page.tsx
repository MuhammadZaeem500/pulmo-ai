// src/app/admin/dashboard/page.tsx
"use client";

import React from "react";
import DashboardCard from "@/components/doctor/DashboardCard";
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
  Eye, 
  ChevronRight 
} from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Title & Welcome */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Welcome back. Here&apos;s what&apos;s happening on the platform.</p>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Total Users</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">48,291</h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">+12% this month</p>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Active Patients</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">31,847</h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">+8% this month</p>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Verified Clinics</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">1,247</h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">+23 this week</p>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Active Alerts</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">7</h3>
          <p className="text-[11px] text-rose-600 font-semibold mt-1">3 critical</p>
        </DashboardCard>
      </div>

      {/* Main Grid: Recent Activities & Quick Actions / Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Activities (Spans 2 cols) */}
        <div className="lg:col-span-2">
          <DashboardCard>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Recent Activities</h3>
              <button className="text-xs font-semibold text-blue-600 hover:underline">View all</button>
            </div>

            <div className="space-y-4">
              {[
                { title: "New clinic verified", desc: "Riverside Pulmonary Center, CA", time: "12 min ago", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
                { title: "Security alert flagged", desc: "Suspicious login attempt detected", time: "34 min ago", icon: AlertTriangle, color: "text-rose-600 bg-rose-50" },
                { title: "New user registered", desc: "Dr. Emily Watson joined", time: "1 hr ago", icon: Users, color: "text-blue-600 bg-blue-50" },
                { title: "Report generated", desc: "Monthly analytics report ready", time: "2 hr ago", icon: FileText, color: "text-purple-600 bg-purple-50" },
                { title: "Clinic information updated", desc: "Metro General Hospital, NY", time: "3 hr ago", icon: Building2, color: "text-teal-600 bg-teal-50" },
                { title: "Alert resolved", desc: "Fake review cluster removed", time: "4 hr ago", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
              ].map((act, idx) => {
                const Icon = act.icon;
                return (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl shrink-0 ${act.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{act.title}</h4>
                        <p className="text-[11px] text-slate-400 font-medium">{act.desc}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">{act.time}</span>
                  </div>
                );
              })}
            </div>
          </DashboardCard>
        </div>

        {/* Right Column: Quick Actions & Notifications */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <DashboardCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={() => alert("Add Clinic modal")} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/80 transition-all text-center flex flex-col items-center justify-center gap-2 group">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">Add Clinic</span>
              </button>

              <button onClick={() => alert("View Alerts")} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/80 transition-all text-center flex flex-col items-center justify-center gap-2 group">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">View Alerts</span>
              </button>

              <button onClick={() => alert("Generate Report")} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/80 transition-all text-center flex flex-col items-center justify-center gap-2 group">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">Generate Report</span>
              </button>

              <button onClick={() => alert("Send Notification")} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/80 transition-all text-center flex flex-col items-center justify-center gap-2 group">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Send className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">Send Notification</span>
              </button>
            </div>
          </DashboardCard>

          {/* Notifications Card */}
          <DashboardCard>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
              <button className="text-xs font-semibold text-blue-600 hover:underline">View all</button>
            </div>

            <div className="space-y-3">
              {[
                { title: "3 clinics pending verification", time: "1 hr ago", color: "bg-blue-500" },
                { title: "Security report ready to download", time: "2 hr ago", color: "bg-emerald-500" },
                { title: "System maintenance scheduled — Jun 15", time: "5 hr ago", color: "bg-amber-500" },
              ].map((notif, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50/60 border border-slate-100 flex items-start gap-2.5">
                  <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${notif.color}`} />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-snug">{notif.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}