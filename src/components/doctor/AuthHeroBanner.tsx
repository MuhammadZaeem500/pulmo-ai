import React from "react";
import { Stethoscope, Activity, Shield } from "lucide-react";

export default function AuthHeroBanner() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 via-blue-700 to-teal-500 p-12 flex-col justify-between text-white overflow-hidden">
     
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

     
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight">PulmoAI</span>
          <p className="text-xs text-blue-100 font-medium">Doctor Portal</p>
        </div>
      </div>

     
      <div className="relative z-10 max-w-md my-auto">
        <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-4">
          Your patients,<br /> all in one place.
        </h1>

        <div className="space-y-4 mt-8">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="p-2 rounded-xl bg-white/10 text-white shrink-0 mt-0.5">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Complete Patient Records</h3>
              <p className="text-xs text-blue-100 mt-0.5">
                Access full histories, scans, and chat logs before every consultation
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="p-2 rounded-xl bg-white/10 text-white shrink-0 mt-0.5">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">AI-Assisted Insights</h3>
              <p className="text-xs text-blue-100 mt-0.5">
                PulmoAI surfaces symptom patterns and anomalies automatically
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="p-2 rounded-xl bg-white/10 text-white shrink-0 mt-0.5">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">HIPAA Compliant</h3>
              <p className="text-xs text-blue-100 mt-0.5">
                End-to-end encrypted. Your patients&apos; data stays private
              </p>
            </div>
          </div>
        </div>
      </div>

     
      <div className="relative z-10 text-xs text-blue-200">
        © 2026 PulmoAI. HIPAA-Compliant Healthcare Platform.
      </div>
    </div>
  );
}