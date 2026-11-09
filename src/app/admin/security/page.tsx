"use client";

import React, { useState } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import MetricCard from "@/components/common/MetricCard";
import SecurityAlertModal from "@/components/admin/SecurityAlertModal";
import { 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Lock, 
  Star, 
  User, 
  Wifi, 
  Eye 
} from "lucide-react";
import { SecurityAlert } from "@/types/admin.types";

export default function SecurityCenterPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    { id: 1, title: "Unauthorized Access", severity: "Critical", status: "Open", description: "Multiple failed login attempts from IP 192.168.1.47 — account locked", date: "Jun 12, 2026", icon: Lock },
    { id: 2, title: "Fake Review Detected", severity: "High", status: "Investigating", description: "Cluster of 14 suspiciously similar reviews from Metro Clinic detected", date: "Jun 12, 2026", icon: Star },
    { id: 3, title: "Suspicious Account", severity: "High", status: "Open", description: "New account j.fake91@tempmail.com exhibiting bot-like behavior", date: "Jun 11, 2026", icon: User },
    { id: 4, title: "Unauthorized Access", severity: "Medium", status: "Investigating", description: "Admin panel accessed from unrecognized device — India", date: "Jun 11, 2026", icon: Wifi },
    { id: 5, title: "Fake Review Detected", severity: "Medium", status: "Resolved", description: "5 duplicate reviews found for Breathe Well Clinic", date: "Jun 10, 2026", icon: Star },
    { id: 6, title: "Suspicious Account", severity: "Low", status: "Resolved", description: "Account r.tanner99@gmail.com created profile without email verification", date: "Jun 9, 2026", icon: User },
    { id: 7, title: "Unauthorized Access", severity: "Critical", status: "Resolved", description: "API key leaked via public repository — key rotated immediately", date: "Jun 8, 2026", icon: Lock },
    { id: 8, title: "Fake Review Detected", severity: "Low", status: "Resolved", description: "Duplicate review for Pacific Lung Associates removed", date: "Jun 7, 2026", icon: Star },
  ]);

  const handleResolveAlert = (alertId: number) => {
    setAlerts(alerts.map(a => a.id === alertId ? { ...a, status: "Resolved" } : a));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (selectedFilter === "All") return true;
    return alert.severity === selectedFilter || alert.status === selectedFilter;
  });

  return (
    <div className="space-y-6">
     
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Security Center</h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">Monitor platform integrity, suspicious activity, and unauthorized access.</p>
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Alerts"
          value={alerts.length}
          valueColor="text-blue-600"
          icon={ShieldAlert}
          iconBgColor="bg-blue-50 text-blue-600"
        />
        <MetricCard
          title="Open"
          value={alerts.filter(a => a.status === "Open").length}
          valueColor="text-rose-500"
          icon={AlertTriangle}
          iconBgColor="bg-rose-50 text-rose-500"
        />
        <MetricCard
          title="Investigating"
          value={alerts.filter(a => a.status === "Investigating").length}
          valueColor="text-amber-500"
          icon={Clock}
          iconBgColor="bg-amber-50 text-amber-500"
        />
        <MetricCard
          title="Resolved"
          value={alerts.filter(a => a.status === "Resolved").length}
          valueColor="text-teal-600"
          icon={CheckCircle2}
          iconBgColor="bg-teal-50 text-teal-600"
        />
      </div>

     
      <DashboardCard title="Severity Overview">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 text-center">
            <span className="text-2xl font-extrabold text-rose-500 block">
              {alerts.filter(a => a.severity === "Critical").length}
            </span>
            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider mt-1 block">Critical</span>
          </div>
          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 text-center">
            <span className="text-2xl font-extrabold text-amber-600 block">
              {alerts.filter(a => a.severity === "High").length}
            </span>
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mt-1 block">High</span>
          </div>
          <div className="bg-yellow-50/50 border border-yellow-100 rounded-2xl p-4 text-center">
            <span className="text-2xl font-extrabold text-yellow-600 block">
              {alerts.filter(a => a.severity === "Medium").length}
            </span>
            <span className="text-[11px] font-bold text-yellow-600 uppercase tracking-wider mt-1 block">Medium</span>
          </div>
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 text-center">
            <span className="text-2xl font-extrabold text-teal-600 block">
              {alerts.filter(a => a.severity === "Low").length}
            </span>
            <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider mt-1 block">Low</span>
          </div>
        </div>
      </DashboardCard>

     
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["All", "Critical", "High", "Medium", "Low", "Open", "Investigating", "Resolved"].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              selectedFilter === filter
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

     
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const AlertIcon = alert.icon;
          return (
            <div 
              key={alert.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertIcon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900">{alert.title}</h3>
                    
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      alert.severity === "Critical" ? "bg-rose-50 text-rose-600 border border-rose-100" :
                      alert.severity === "High" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                      alert.severity === "Medium" ? "bg-yellow-50 text-yellow-600 border border-yellow-100" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {alert.severity}
                    </span>

                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      alert.status === "Open" ? "bg-rose-50 text-rose-600" :
                      alert.status === "Investigating" ? "bg-amber-50 text-amber-600" :
                      "bg-teal-50 text-teal-600"
                    }`}>
                      {alert.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">{alert.description}</p>
                  <span className="text-[11px] text-slate-400 block pt-0.5">{alert.date}</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedAlert(alert);
                  setIsModalOpen(true);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

     
      <SecurityAlertModal
        alert={selectedAlert}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onResolve={handleResolveAlert}
      />
    </div>
  );
}