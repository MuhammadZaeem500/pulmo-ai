"use client";

import DashboardCard from "@/components/doctor/DashboardCard";
import { Calendar, CheckCircle2, Clock, Check, ChevronRight } from "lucide-react";

export default function DoctorAppointmentsPage() {
  const todaysAppointments = [
    { time: "09:00 AM", name: "James Wilson", type: "Follow-up", initials: "JW", status: "Completed", statusColor: "text-emerald-600 bg-emerald-50" },
    { time: "10:30 AM", name: "Maria Santos", type: "Routine Check", initials: "MS", status: "In Progress", statusColor: "text-blue-600 bg-blue-50" },
    { time: "02:00 PM", name: "Robert Kim", type: "Test Review", initials: "RK", status: "Pending", statusColor: "text-amber-600 bg-amber-50" },
    { time: "03:30 PM", name: "Emma Thompson", type: "New Patient", initials: "ET", status: "Pending", statusColor: "text-amber-600 bg-amber-50" },
  ];

  const upcomingAppointments = [
    {
      date: "Monday, June 15",
      count: 2,
      appointments: [
        { time: "10:00 AM", name: "David Osei", type: "Follow-up", initials: "DO", status: "Pending" },
        { time: "11:30 AM", name: "Priya Patel", type: "Prescription Review", initials: "PP", status: "Pending" },
      ]
    },
    {
      date: "Thursday, June 18",
      count: 1,
      appointments: [
        { time: "09:30 AM", name: "James Wilson", type: "Spirometry Review", initials: "JW", status: "Pending" },
      ]
    },
    {
      date: "Saturday, June 20",
      count: 1,
      appointments: [
        { time: "02:30 PM", name: "Robert Kim", type: "Transplant Discussion", initials: "RK", status: "Pending" },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics Cards */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Appointments</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Thursday, 12 June 2026</p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-xl border border-slate-200/80 px-4 py-2 text-center shadow-sm">
            <span className="text-sm font-extrabold text-blue-600 block">4</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Today</span>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 px-4 py-2 text-center shadow-sm">
            <span className="text-sm font-extrabold text-emerald-600 block">1</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Completed</span>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 px-4 py-2 text-center shadow-sm">
            <span className="text-sm font-extrabold text-amber-600 block">3</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Remaining</span>
          </div>
        </div>
      </div>

      {/* Today's Progress Bar Card */}
      <DashboardCard>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
            <Clock className="w-4 h-4 text-blue-600" />
            Today&apos;s Progress
          </div>
          <span className="text-xs font-semibold text-slate-400">1/4 appointments done</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 h-full rounded-full w-1/4" />
        </div>
      </DashboardCard>

      {/* Today's Schedule Card */}
      <DashboardCard>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
            <h3 className="text-sm font-bold text-slate-900">Today — Thursday, 12 June 2026</h3>
          </div>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">4</span>
        </div>

        <div className="space-y-3">
          {todaysAppointments.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/60 border border-slate-100">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-500 w-16">{item.time}</span>
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {item.initials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">{item.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {item.status === "Completed" ? (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-lg text-emerald-600 bg-emerald-50">
                    Completed
                  </span>
                ) : (
                  <>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${item.statusColor}`}>
                      {item.status}
                    </span>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold transition-colors">
                      <Check className="w-3.5 h-3.5" />
                      Complete
                    </button>
                  </>
                )}
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold transition-colors">
                  Record
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      {/* Upcoming Appointments Section Header */}
      <div className="flex items-center gap-2 pt-4">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-extrabold text-slate-900">Upcoming Appointments</h2>
      </div>

      {/* Upcoming Appointments Cards */}
      <div className="space-y-6">
        {upcomingAppointments.map((group, groupIdx) => (
          <DashboardCard key={groupIdx}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {group.date}
              </span>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {group.count}
              </span>
            </div>

            <div className="space-y-3">
              {group.appointments.map((appt, apptIdx) => (
                <div key={apptIdx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/60 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-500 w-16">{appt.time}</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                      {appt.initials}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{appt.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium">{appt.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-lg text-amber-600 bg-amber-50">
                      {appt.status}
                    </span>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold transition-colors">
                      <Check className="w-3.5 h-3.5" />
                      Complete
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold transition-colors">
                      Record
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}