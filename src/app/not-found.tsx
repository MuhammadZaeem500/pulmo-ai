"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {

    if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/30 to-teal-50/30 font-['Ubuntu',sans-serif] px-4 py-12">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-lg w-full bg-white/85 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-2xl shadow-blue-500/10 p-8 sm:p-12 text-center">
        
        {/* Floating Brand / Pulse Icon Header */}
        <div className="mx-auto w-16 h-16 bg-linear-to-tr from-[#2F80ED] to-[#14B8A6] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 mb-8 animate-bounce duration-1000">
          <Activity className="w-8 h-8 text-white" />
        </div>

        {/* Big Stylized 404 Header */}
        <div className="relative flex items-center justify-center mb-2">
          <span className="text-7xl sm:text-8xl font-black bg-linear-to-r from-[#2F80ED] to-[#14B8A6] bg-clip-text text-transparent tracking-tight">
            404
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 tracking-tight">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          The medical record, link, or page you are trying to access might have been moved, deleted, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm uppercase bg-linear-to-r from-[#2F80ED] to-[#14B8A6] hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Go To Home
          </Link>
          
          <button
            onClick={handleGoBack}
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm uppercase bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-6 rounded-xl transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

      </div>
    </div>
  );
}