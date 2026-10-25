// src/components/auth/AuthHeroBanner.tsx
import React from "react";
import { Stethoscope } from "lucide-react";

export default function AuthHeroBanner() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 p-12 flex-col justify-between text-white relative select-none">
      {/* Top Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
          <Stethoscope className="w-5 h-5" />
        </div>
        <span className="text-lg font-bold tracking-tight">PulmoAI</span>
      </div>

      {/* Center Hero Copy */}
      <div className="space-y-4 max-w-lg">
        <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
          AI-Powered Pulmonary Health Platform
        </h1>
        <p className="text-sm text-blue-100/90 leading-relaxed">
          Comprehensive administration portal for managing clinics, monitoring health trends, and ensuring platform security.
        </p>
      </div>

      {/* Bottom Feature Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <span className="text-lg font-extrabold block">24/7</span>
          <span className="text-[11px] text-blue-100 font-medium">Health Monitoring</span>
        </div>
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <span className="text-lg font-extrabold block">1,247</span>
          <span className="text-[11px] text-blue-100 font-medium">Verified Clinics</span>
        </div>
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <span className="text-lg font-extrabold block">Real-time</span>
          <span className="text-[11px] text-blue-100 font-medium">Security Alerts</span>
        </div>
      </div>
    </div>
  );
}