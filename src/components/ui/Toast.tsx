"use client";

import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  XCircle,
  X,
  Loader2,
} from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastProps extends ToastMessage {
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  onClose,
  action,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (type === "loading") return;

    const duration = type === "error" ? 5000 : 4000;
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, type, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300);
  };

  const config = {
    success: {
      bg: "bg-emerald-50 dark:bg-emerald-950",
      border: "border-emerald-200 dark:border-emerald-800",
      icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      titleColor: "text-emerald-900 dark:text-emerald-100",
      messageColor: "text-emerald-700 dark:text-emerald-200",
      progressBg: "bg-emerald-500",
    },
    error: {
      bg: "bg-red-50 dark:bg-red-950",
      border: "border-red-200 dark:border-red-800",
      icon: XCircle,
      iconColor: "text-red-600 dark:text-red-400",
      titleColor: "text-red-900 dark:text-red-100",
      messageColor: "text-red-700 dark:text-red-200",
      progressBg: "bg-red-500",
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-950",
      border: "border-amber-200 dark:border-amber-800",
      icon: AlertCircle,
      iconColor: "text-amber-600 dark:text-amber-400",
      titleColor: "text-amber-900 dark:text-amber-100",
      messageColor: "text-amber-700 dark:text-amber-200",
      progressBg: "bg-amber-500",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-950",
      border: "border-blue-200 dark:border-blue-800",
      icon: Info,
      iconColor: "text-blue-600 dark:text-blue-400",
      titleColor: "text-blue-900 dark:text-blue-100",
      messageColor: "text-blue-700 dark:text-blue-200",
      progressBg: "bg-blue-500",
    },
    loading: {
      bg: "bg-slate-50 dark:bg-slate-950",
      border: "border-slate-200 dark:border-slate-800",
      icon: Loader2,
      iconColor: "text-slate-600 dark:text-slate-400 animate-spin",
      titleColor: "text-slate-900 dark:text-slate-100",
      messageColor: "text-slate-700 dark:text-slate-200",
      progressBg: "bg-slate-500",
    },
  };

  const c = config[type];
  const IconComponent = c.icon;

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      <div className={`${c.bg} ${c.border} border rounded-xl shadow-lg p-4 max-w-sm w-full`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <IconComponent className={`w-5 h-5 mt-0.5 flex-shrink-0 ${c.iconColor}`} />
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-sm ${c.titleColor}`}>{title}</h3>
              {message && (
                <p className={`text-sm mt-1 ${c.messageColor} break-words`}>{message}</p>
              )}
            </div>
          </div>
          {type !== "loading" && (
            <button
              onClick={handleClose}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {action && (
          <button
            onClick={() => {
              action.onClick();
              handleClose();
            }}
            className={`mt-3 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              type === "success"
                ? "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900"
                : type === "error"
                  ? "text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900"
                  : type === "warning"
                    ? "text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900"
                    : "text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900"
            }`}
          >
            {action.label}
          </button>
        )}

        <div className="mt-3 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${c.progressBg} animate-shrink`}
            style={{
              animation: type === "error" ? "shrink 5s linear forwards" : "shrink 4s linear forwards",
            }}
          />
        </div>
      </div>
    </div>
  );
};
