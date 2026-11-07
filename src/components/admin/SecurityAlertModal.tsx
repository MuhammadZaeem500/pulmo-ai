"use client";

import { X, Lock, Star, User, Wifi } from "lucide-react";
import { SecurityAlertModalProps } from "@/types/modal.types";

export default function SecurityAlertModal({
  alert,
  isOpen,
  onClose,
  onResolve,
}: SecurityAlertModalProps) {
  if (!isOpen || !alert) return null;

  const AlertIcon = alert.icon || Lock;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs shrink-0">
            <AlertIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {alert.title}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Alert #{alert.id}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 mb-6 text-xs text-slate-700 leading-relaxed font-medium">
          {alert.description}
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
              Severity
            </span>
            <span
              className={`font-bold ${
                alert.severity === "Critical"
                  ? "text-rose-600"
                  : alert.severity === "High"
                    ? "text-amber-600"
                    : "text-yellow-600"
              }`}
            >
              {alert.severity}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
              Status
            </span>
            <span
              className={`font-bold ${
                alert.status === "Open"
                  ? "text-rose-600"
                  : alert.status === "Investigating"
                    ? "text-amber-600"
                    : "text-teal-600"
              }`}
            >
              {alert.status}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
              Date
            </span>
            <span className="font-semibold text-slate-800">{alert.date}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onResolve(alert.id);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition-all cursor-pointer"
          >
            Mark Resolved
          </button>
        </div>
      </div>
    </div>
  );
}
