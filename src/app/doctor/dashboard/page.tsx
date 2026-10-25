// src/app/doctor/dashboard/page.tsx
"use client";

import DashboardCard from "@/components/doctor/dashboard/DashboardCard";
import { 
  Calendar, 
  Users, 
  FileText, 
  Pill, 
  Clock, 
  CheckCircle2 
} from "lucide-react";

export default function DoctorDashboardPage() {
  return (
    <div className="min-h-screen flex w-full bg-white font-sans">

      {/* Main Dashboard Content Area */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen space-y-6 bg-white">
        {/* Top Greeting */}
        <div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
            <h1 className="text-xl font-extrabold text-slate-900">Good morning, Dr. Mitchell</h1>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5 ml-3.5">
            Sunday, October 25, 2026
          </p>
        </div>

        {/* Top Metrics Grid using DashboardCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                1 completed
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">4</h2>
              <p className="text-xs text-slate-500 font-medium">Today&apos;s Appointments</p>
            </div>
          </DashboardCard>

          <DashboardCard>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                6 seen this week
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">47</h2>
              <p className="text-xs text-slate-500 font-medium">Active Patients</p>
            </div>
          </DashboardCard>

          <DashboardCard>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                Needs attention
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">3</h2>
              <p className="text-xs text-slate-500 font-medium">Pending Notes</p>
            </div>
          </DashboardCard>

          <DashboardCard>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                2 new, 3 renewed
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">5</h2>
              <p className="text-xs text-slate-500 font-medium">Prescriptions Today</p>
            </div>
          </DashboardCard>
        </div>

        {/* Second Row: Schedule & Recent Patients */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardCard title="Today's Schedule" icon={<Clock className="w-4 h-4" />} viewAllLink="/doctor/appointments">
            {[
              { time: "09:00 AM", name: "James Wilson", type: "Follow-up", status: "Completed", color: "text-emerald-600 bg-emerald-50" },
              { time: "10:30 AM", name: "Maria Santos", type: "Routine Check", status: "In Progress", color: "text-blue-600 bg-blue-50" },
              { time: "02:00 PM", name: "Robert Kim", type: "Test Review", status: "Pending", color: "text-amber-600 bg-amber-50" },
              { time: "03:30 PM", name: "Emma Thompson", type: "New Patient", status: "Pending", color: "text-amber-600 bg-amber-50" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 w-16">{item.time}</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    {item.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">{item.type}</p>
                  </div>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${item.color}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </DashboardCard>

          <DashboardCard title="Recent Patients" icon={<Users className="w-4 h-4" />} viewAllLink="/doctor/patients">
            {[
              { name: "James Wilson", details: "COPD · 45y · Male", status: "Stable", color: "text-emerald-600 bg-emerald-50" },
              { name: "Maria Santos", details: "Asthma · 32y · Female", status: "Active", color: "text-blue-600 bg-blue-50" },
              { name: "Robert Kim", details: "Pulmonary Fibrosis · 67y · Male", status: "Critical", color: "text-rose-600 bg-rose-50" },
              { name: "Emma Thompson", details: "Chronic Bronchitis · 28y · Female", status: "Stable", color: "text-emerald-600 bg-emerald-50" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    {item.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">{item.details}</p>
                  </div>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${item.color}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </DashboardCard>
        </div>

        {/* Third Row: Pending Notes & Recent Prescriptions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardCard title="Pending Notes" icon={<FileText className="w-4 h-4" />} viewAllLink="/doctor/notes">
            {[
              { name: "James Wilson", diagnosis: "COPD Stage II — Stable", date: "2026-06-08" },
              { name: "Maria Santos", diagnosis: "Moderate Persistent Asthma — Partially Controlled", date: "2026-06-10" },
              { name: "Robert Kim", diagnosis: "IPF — Progressive Decline", date: "2026-06-05" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/30 border border-amber-100/60">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">{item.diagnosis}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{item.date}</p>
                  </div>
                </div>
                <button className="text-xs font-semibold text-blue-600 hover:underline">Edit</button>
              </div>
            ))}
          </DashboardCard>

          <DashboardCard title="Recent Prescriptions" icon={<Pill className="w-4 h-4" />} viewAllLink="/doctor/prescriptions">
            {[
              { name: "James Wilson", meds: "2 medications", date: "2026-06-08" },
              { name: "Maria Santos", meds: "3 medications", date: "2026-06-10" },
              { name: "Robert Kim", meds: "2 medications", date: "2026-06-05" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/60 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    {item.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">{item.meds} · {item.date}</p>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            ))}
          </DashboardCard>
        </div>
      </main>
    </div>
  );
}