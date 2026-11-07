"use client";

import React from "react";
import { X, CheckCircle2, Clock, XCircle } from "lucide-react";
import { UserDetailsModalProps } from "@/types/modal.types";

export default function UserDetailsModal({
  user,
  isOpen,
  onClose,
  onToggleSuspend,
}: UserDetailsModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-100">
          <div
            className={`w-14 h-14 rounded-2xl ${user.avatarBg} text-white font-extrabold text-lg flex items-center justify-center shadow-md`}
          >
            {user.initials}
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {user.name}
            </h3>
            <p className="text-xs text-slate-400 font-medium">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
              Role
            </span>
            <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
              {user.role}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
              Status
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                user.status === "Active"
                  ? "bg-emerald-50 text-emerald-600"
                  : user.status === "Pending"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-rose-50 text-rose-600"
              }`}
            >
              {user.status === "Active" && <CheckCircle2 className="w-3 h-3" />}
              {user.status === "Pending" && <Clock className="w-3 h-3" />}
              {user.status === "Suspended" && <XCircle className="w-3 h-3" />}
              {user.status}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
              Registered
            </span>
            <span className="font-semibold text-slate-800">
              {user.registered}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
              Last Login
            </span>
            <span className="font-semibold text-slate-800">
              {user.lastLogin}
            </span>
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
              onToggleSuspend(user.id);
              onClose();
            }}
            className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all cursor-pointer ${
              user.status === "Suspended"
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
            }`}
          >
            {user.status === "Suspended" ? "Activate User" : "Suspend User"}
          </button>
        </div>
      </div>
    </div>
  );
}
