"use client";

import { useState, useEffect } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import { CheckCircle2, Clock, Check, ChevronRight, Loader2 } from "lucide-react";
import { appointmentService } from "@/services/appointment.service";
import { useRouter } from "next/navigation";

// Normalize DB enum values (e.g. "COMPLETED") to display labels (e.g. "Completed")
const normalizeStatus = (raw: string): string => {
  const map: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  return map[raw] ?? raw;
};

const statusStyle = (status: string): string => {
  switch (status) {
    case "Completed":  return "text-emerald-600 bg-emerald-50";
    case "Confirmed":  return "text-blue-600 bg-blue-50";
    case "Cancelled":  return "text-red-500 bg-red-50";
    default:           return "text-amber-600 bg-amber-50"; // Pending
  }
};

export default function DoctorAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointments();
      // Normalize statuses from DB enum → display labels
      setAppointments(
        data.map((appt: any) => ({ ...appt, status: normalizeStatus(appt.status) }))
      );
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
    setCompleting(id);
    try {
      await appointmentService.updateStatus(id, "Completed");
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: "Completed" } : appt
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update appointment status.");
    } finally {
      setCompleting(null);
    }
  };

  const totalCount     = appointments.length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;
  const remainingCount = totalCount - completedCount;
  const progressPct    = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Appointments</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Live Schedule Overview</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white rounded-xl border border-slate-200/80 px-4 py-2 text-center shadow-sm">
            <span className="text-sm font-extrabold text-blue-600 block">{totalCount}</span>
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

      {/* Progress bar */}
      <DashboardCard>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
            <Clock className="w-4 h-4 text-blue-600" />
            Schedule Progress
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {completedCount}/{totalCount} appointments done
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-teal-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </DashboardCard>

      {/* Appointments list */}
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
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              {appointments.length}
            </span>
          </div>

          <div className="space-y-3">
            {appointments.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/60 border border-slate-100"
              >
                {/* Left: time + avatar + name */}
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-500 w-24">{item.time}</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    {item.patientInitials || "PT"}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{item.patientName}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {item.type} · {item.date}
                    </p>
                  </div>
                </div>

                {/* Right: status badge + actions */}
                <div className="flex items-center gap-2">
                  {item.status === "Completed" ? (
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-lg text-emerald-600 bg-emerald-50 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  ) : (
                    <>
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${statusStyle(item.status)}`}>
                        {item.status}
                      </span>
                      {item.status !== "Cancelled" && (
                        <button
                          onClick={() => handleComplete(item.id)}
                          disabled={completing === item.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {completing === item.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          Complete
                        </button>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => router.push("/doctor/notes")}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Record
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

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