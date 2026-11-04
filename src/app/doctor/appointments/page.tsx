"use client";

import { useState, useEffect } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import { Calendar, CheckCircle2, Clock, Check, ChevronRight, Loader2 } from "lucide-react";
import { appointmentService } from "@/services/appointment.service";
import { useRouter } from "next/navigation";

export default function DoctorAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleComplete = async (id: string) => {
    try {
      await appointmentService.updateStatus(id, "Completed");
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: "Completed" } : appt
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update appointment status.");
    }
  };

  const totalToday = appointments.length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;
  const remainingCount = totalToday - completedCount;
  const progressPercentage = totalToday > 0 ? (completedCount / totalToday) * 100 : 0;

  return (
    <div className="space-y-6">
     
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Appointments</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Live Schedule Overview</p>
        </div>

       
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-xl border border-slate-200/80 px-4 py-2 text-center shadow-sm">
            <span className="text-sm font-extrabold text-blue-600 block">{totalToday}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total</span>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 px-4 py-2 text-center shadow-sm">
            <span className="text-sm font-extrabold text-emerald-600 block">{completedCount}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Completed</span>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 px-4 py-2 text-center shadow-sm">
            <span className="text-sm font-extrabold text-amber-600 block">{remainingCount}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Remaining</span>
          </div>
        </div>
      </div>

     
      <DashboardCard>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
            <Clock className="w-4 h-4 text-blue-600" />
            Schedule Progress
          </div>
          <span className="text-xs font-semibold text-slate-400">{completedCount}/{totalToday} appointments done</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-600 to-teal-500 h-full rounded-full transition-all duration-300" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </DashboardCard>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <DashboardCard>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
              <h3 className="text-sm font-bold text-slate-900">Scheduled Appointments</h3>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">{appointments.length}</span>
          </div>

          <div className="space-y-3">
            {appointments.map((item) => {
              const statusColor = 
                item.status === "Completed" ? "text-emerald-600 bg-emerald-50" :
                item.status === "In Progress" ? "text-blue-600 bg-blue-50" : "text-amber-600 bg-amber-50";

              return (
                <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/60 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-500 w-24">{item.time}</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                      {item.patientInitials || "PT"}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{item.patientName}</h4>
                      <p className="text-[11px] text-slate-400 font-medium">{item.type} · {item.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status === "Completed" ? (
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-lg text-emerald-600 bg-emerald-50 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    ) : (
                      <>
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${statusColor}`}>
                          {item.status}
                        </span>
                        <button 
                          onClick={() => handleComplete(item.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Complete
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => router.push(`/doctor/notes`)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Record
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {appointments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 text-sm">No appointments scheduled.</p>
              </div>
            )}
          </div>
        </DashboardCard>
      )}
    </div>
  );
}