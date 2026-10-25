// src/components/paitient/AuthHeroBanner.tsx
import React from "react";
import { Activity } from "lucide-react";

export default function AuthHeroBanner() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2F80ED] to-[#14B8A6] p-12 flex-col justify-between text-white relative select-none overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRo dD0iQzM2IDE4YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02em0wIDE4YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-20"></div>

      {/* Top Logo */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
          <Activity className="w-5 h-5" />
        </div>
        <span className="text-lg font-bold tracking-tight">PulmoAI</span>
      </div>

      {/* Center Hero Copy */}
      <div className="space-y-4 max-w-md relative z-10 my-auto">
        <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
          Welcome Back to PulmoAI
        </h1>
        <p className="text-sm text-white/90 leading-relaxed">
          Access your AI-powered health dashboard and continue your wellness journey with advanced pulmonary monitoring.
        </p>
      </div>

      {/* Bottom Feature Cards */}
      <div className="grid grid-cols-3 gap-3 relative z-10">
        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <span className="text-base font-extrabold block">24/7</span>
          <span className="text-[10px] text-white/80 font-medium">Monitoring</span>
        </div>
        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <span className="text-base font-extrabold block">Secure</span>
          <span className="text-[10px] text-white/80 font-medium">HIPAA Aligned</span>
        </div>
        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <span className="text-base font-extrabold block">AI-Driven</span>
          <span className="text-[10px] text-white/80 font-medium">Insights</span>
        </div>
      </div>
    </div>
  );
}