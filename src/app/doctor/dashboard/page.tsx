"use client";

import { useState, useEffect } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import { 
  Calendar, 
  Users, 
  FileText, 
  Pill, 
  Clock, 
  CheckCircle2, 
  Loader2 
} from "lucide-react";
import api from "@/services/api"; 

export default function DoctorDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      todayAppointmentsCount: 0,
      activePatientsCount: 0,
      pendingNotesCount: 0,
      prescriptionsTodayCount: 0,
    },
    appointments: [],
    recentPatients: [],
    pendingNotes: [],
    prescriptions: [],
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const { data } = await api.get("/doctor/dashboard"); 
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, Doctor</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5 ml-3.5">
          {currentDate}
        </p>
      </div>

       
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                {dashboardData.metrics.todayAppointmentsCount}
              </h2>
              <p className="text-xs text-slate-500 font-medium">Today&apos;s Appointments</p>
            </div>
          </DashboardCard>

          <DashboardCard>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                {dashboardData.metrics.activePatientsCount}
              </h2>
              <p className="text-xs text-slate-500 font-medium">Active Patients</p>
            </div>
          </DashboardCard>

          <DashboardCard>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                {dashboardData.metrics.pendingNotesCount}
              </h2>
              <p className="text-xs text-slate-500 font-medium">Clinical Notes</p>
            </div>
          </DashboardCard>

          <DashboardCard>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                {dashboardData.metrics.prescriptionsTodayCount}
              </h2>
              <p className="text-xs text-slate-500 font-medium">Prescriptions Today</p>
            </div>
          </DashboardCard>
        </div>

       
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardCard title="Today's Schedule" icon={<Clock className="w-4 h-4" />} viewAllLink="/doctor/appointments">
            {dashboardData.appointments.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No appointments scheduled for today.</p>
            ) : (
              dashboardData.appointments.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 w-16">{item.time}</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      {item.name.split(" ").map((n: string) => n[0]).join("")}
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
              ))
            )}
          </DashboardCard>

          <DashboardCard title="Recent Patients" icon={<Users className="w-4 h-4" />} viewAllLink="/doctor/patients">
            {dashboardData.recentPatients.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No recent patients found.</p>
            ) : (
              dashboardData.recentPatients.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      {item.name.split(" ").map((n: string) => n[0]).join("")}
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
              ))
            )}
          </DashboardCard>
        </div>

       
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardCard title="Clinical Notes" icon={<FileText className="w-4 h-4" />} viewAllLink="/doctor/notes">
            {dashboardData.pendingNotes.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No Clinical notes.</p>
            ) : (
              dashboardData.pendingNotes.map((item: any, idx: number) => (
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
                  {/* <button className="text-xs font-semibold text-blue-600 hover:underline">Edit</button> */}
                </div>
              ))
            )}
          </DashboardCard>

          <DashboardCard title="Recent Prescriptions" icon={<Pill className="w-4 h-4" />} viewAllLink="/doctor/prescriptions">
            {dashboardData.prescriptions.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No recent prescriptions.</p>
            ) : (
              dashboardData.prescriptions.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/60 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      {item.name.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                      <p className="text-[11px] text-slate-400">{item.meds} · {item.date}</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              ))
            )}
          </DashboardCard>
        </div>
    </div>
  );
}