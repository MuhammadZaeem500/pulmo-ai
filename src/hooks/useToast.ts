import React from "react";
import { ToastMessage, ToastType } from "@/components/ui/Toast";

export const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration ?? (toast.type === "error" ? 5000 : 4000),
    };
    setToasts((prev) => [...prev, newToast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const success = (title: string, message?: string, action?: ToastMessage["action"]) =>
    addToast({ type: "success", title, message, action });

  const error = (title: string, message?: string, action?: ToastMessage["action"]) =>
    addToast({ type: "error", title, message, action });

  const warning = (title: string, message?: string, action?: ToastMessage["action"]) =>
    addToast({ type: "warning", title, message, action });

  const info = (title: string, message?: string, action?: ToastMessage["action"]) =>
    addToast({ type: "info", title, message, action });

  const loading = (title: string, message?: string) =>
    addToast({ type: "loading", title, message, duration: 0 });

  return {
    toasts,
    removeToast,
    success,
    error,
    warning,
    info,
    loading,
  };
};
