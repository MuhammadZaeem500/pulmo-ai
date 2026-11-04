"use client";

import React, { useState } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import MetricCard from "@/components/common/MetricCard";
import { Activity, Wind, Users, TrendingUp } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"Symptom Trends" | "Conditions" | "Seasonal Trends" | "User Engagement">("Symptom Trends");

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Healthcare Analytics</h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Monitor health trends, disease patterns, and user engagement across the platform.</p>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Avg. Daily Queries"
          value="4,821"
          trend="+14%"
          trendColor="text-emerald-600"
          icon={Activity}
          iconBgColor="bg-blue-50 text-blue-600"
        />
        <MetricCard
          title="Conditions Monitored"
          value="24"
          trend="+2 new"
          trendColor="text-emerald-600"
          icon={Wind}
          iconBgColor="bg-teal-50 text-teal-600"
        />
        <MetricCard
          title="Active Users (30d)"
          value="31,847"
          trend="+8%"
          trendColor="text-emerald-600"
          icon={Users}
          iconBgColor="bg-purple-50 text-purple-600"
        />
        <MetricCard
          title="Trend Alerts Triggered"
          value="18"
          trend="This month"
          trendColor="text-amber-600"
          icon={TrendingUp}
          iconBgColor="bg-amber-50 text-amber-600"
        />
      </div>

      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/80 w-full sm:w-fit shadow-xs overflow-x-auto whitespace-nowrap scrollbar-none">
        {(["Symptom Trends", "Conditions", "Seasonal Trends", "User Engagement"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Symptom Trends" && (
        <DashboardCard title="Symptom Trend Analysis">
          <p className="text-xs text-slate-400 font-medium pb-2">Reported symptoms per month across all registered patients.</p>

          <div className="pt-4 pb-2">
            <div className="h-72 w-full flex flex-col justify-between relative border-b border-l border-slate-200 p-4">
              <div className="absolute inset-x-4 top-4 border-b border-slate-100 flex justify-between text-[10px] text-slate-400"><span>3800</span></div>
              <div className="absolute inset-x-4 top-20 border-b border-slate-100 flex justify-between text-[10px] text-slate-400"><span>2850</span></div>
              <div className="absolute inset-x-4 top-36 border-b border-slate-100 flex justify-between text-[10px] text-slate-400"><span>1900</span></div>
              <div className="absolute inset-x-4 top-52 border-b border-slate-100 flex justify-between text-[10px] text-slate-400"><span>950</span></div>

              <svg className="absolute inset-0 w-full h-full p-4 overflow-visible pointer-events-none" preserveAspectRatio="none" viewBox="0 0 600 200">
                <path d="M 0,80 Q 150,60 300,90 T 600,40" fill="none" stroke="#2563EB" strokeWidth="2.5" />
                <path d="M 0,130 Q 150,110 300,95 T 600,75" fill="none" stroke="#0D9488" strokeWidth="2.5" />
                <path d="M 0,165 Q 150,160 300,155 T 600,145" fill="none" stroke="#8B5CF6" strokeWidth="2.5" />
                <path d="M 0,185 Q 150,180 300,190 T 600,175" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
              </svg>

              <div className="mt-auto pt-6 flex justify-between text-xs font-semibold text-slate-400 z-10">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 text-xs font-semibold flex-wrap">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-600 inline-block" /><span className="text-slate-600">cough</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-teal-600 inline-block" /><span className="text-slate-600">dyspnea</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-600 inline-block" /><span className="text-slate-600">wheezing</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /><span className="text-slate-600">chest_pain</span></div>
            </div>
          </div>
        </DashboardCard>
      )}

      {activeTab === "Conditions" && (
        <DashboardCard title="Frequently Reported Pulmonary Conditions">
          <p className="text-xs text-slate-400 font-medium pb-4">Total diagnosed conditions across the patient base.</p>

          <div className="space-y-4 pt-2 overflow-x-auto">
            {[
              { name: "COPD", count: 7600, max: 14000 },
              { name: "Asthma", count: 12500, max: 14000 },
              { name: "Pneumonia", count: 4200, max: 14000 },
              { name: "Pulmonary Fibrosis", count: 2100, max: 14000 },
              { name: "Sleep Apnea", count: 6800, max: 14000 },
              { name: "Bronchitis", count: 3900, max: 14000 },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-4 text-xs min-w-[320px]">
                <span className="w-36 font-semibold text-slate-600 text-right truncate">{item.name}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden p-0.5">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(item.count / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-between text-[11px] font-semibold text-slate-400 pl-36 pt-2 border-t border-slate-100 min-w-[320px]">
              <span>0</span>
              <span>3500</span>
              <span>7000</span>
              <span>10500</span>
              <span>14000</span>
            </div>
          </div>
        </DashboardCard>
      )}

      {activeTab === "Seasonal Trends" && (
        <DashboardCard title="Seasonal Health Trends">
          <p className="text-xs text-slate-400 font-medium pb-2">Monthly case volume comparison — current year vs. previous year.</p>

          <div className="pt-4 pb-2">
            <div className="h-72 w-full flex flex-col justify-between relative border-b border-l border-slate-200 p-4">
              <div className="absolute inset-x-4 top-4 border-b border-slate-100 flex justify-between text-[10px] text-slate-400"><span>8000</span></div>
              <div className="absolute inset-x-4 top-20 border-b border-slate-100 flex justify-between text-[10px] text-slate-400"><span>6000</span></div>
              <div className="absolute inset-x-4 top-36 border-b border-slate-100 flex justify-between text-[10px] text-slate-400"><span>4000</span></div>
              <div className="absolute inset-x-4 top-52 border-b border-slate-100 flex justify-between text-[10px] text-slate-400"><span>2000</span></div>

              <svg className="absolute inset-0 w-full h-full p-4 overflow-visible pointer-events-none" preserveAspectRatio="none" viewBox="0 0 600 200">
                <path d="M 0,60 Q 150,50 300,100 T 600,45" fill="none" stroke="#2563EB" strokeWidth="2.5" />
                <path d="M 0,85 Q 150,75 300,120 T 600,65" fill="none" stroke="#0D9488" strokeWidth="2.5" />
              </svg>

              <div className="mt-auto pt-6 flex justify-between text-[11px] font-semibold text-slate-400 z-10">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 text-xs font-semibold">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-600 inline-block" /><span className="text-slate-600">2026</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-teal-600 inline-block" /><span className="text-slate-600">2025</span></div>
            </div>
          </div>
        </DashboardCard>
      )}

      {activeTab === "User Engagement" && (
        <DashboardCard title="User Engagement Trends">
          <p className="text-xs text-slate-400 font-medium pb-2">Weekly active users, sessions, and AI queries over the past 6 weeks.</p>

          <div className="pt-6 pb-2 overflow-x-auto">
            <div className="h-64 w-full min-w-[500px] flex items-end justify-around border-b border-l border-slate-200 px-4 pb-2 relative">
              <div className="absolute inset-x-4 top-0 border-b border-slate-100 text-[10px] text-slate-400">22000</div>
              <div className="absolute inset-x-4 top-16 border-b border-slate-100 text-[10px] text-slate-400">16500</div>
              <div className="absolute inset-x-4 top-32 border-b border-slate-100 text-[10px] text-slate-400">11000</div>
              <div className="absolute inset-x-4 top-48 border-b border-slate-100 text-[10px] text-slate-400">5500</div>

              {[
                { week: "W1", users: "h-32", sessions: "h-52", queries: "h-36" },
                { week: "W2", users: "h-36", sessions: "h-56", queries: "h-40" },
                { week: "W3", users: "h-34", sessions: "h-54", queries: "h-38" },
                { week: "W4", users: "h-40", sessions: "h-60", queries: "h-44" },
                { week: "W5", users: "h-44", sessions: "h-64", queries: "h-48" },
                { week: "W6", users: "h-42", sessions: "h-62", queries: "h-46" },
              ].map((w) => (
                <div key={w.week} className="flex flex-col items-center gap-2 z-10">
                  <div className="flex items-end gap-1.5 h-48">
                    <div className={`w-3.5 sm:w-4 bg-blue-600 rounded-t-md ${w.users}`} />
                    <div className={`w-3.5 sm:w-4 bg-teal-500 rounded-t-md ${w.sessions}`} />
                    <div className={`w-3.5 sm:w-4 bg-purple-500 rounded-t-md ${w.queries}`} />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{w.week}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 text-xs font-semibold">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-blue-600 inline-block" /><span className="text-slate-600">Active Users</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-teal-500 inline-block" /><span className="text-slate-600">Sessions</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-purple-500 inline-block" /><span className="text-slate-600">AI Queries</span></div>
            </div>
          </div>
        </DashboardCard>
      )}
    </div>
  );
}