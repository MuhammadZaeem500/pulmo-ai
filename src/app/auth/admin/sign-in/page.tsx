// src/app/(auth)/admin/sign-in/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Stethoscope, Eye, EyeOff, ShieldCheck } from "lucide-react";
import AuthHeroBanner from "@/components/admin/auth/AuthHeroBanner";

export default function AdminSignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("admin@pulmoai.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Signing in admin: ${email}`);
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans overflow-hidden">
      {/* Reusable Hero Banner */}
      <AuthHeroBanner />

      {/* Right Sign-In Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-white overflow-y-auto max-h-screen">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white lg:hidden">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
              <p className="text-xs text-slate-400 font-medium mt-1">Sign in to your admin account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                />
                <span className="font-medium text-slate-600">Remember me</span>
              </label>
              <Link href="/admin/forgot-password" className="font-semibold text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              Sign In
            </button>

            <p className="text-center text-xs text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/auth/admin/sign-up" className="font-bold text-blue-600 hover:underline">
                Create account
              </Link>
            </p>
          </form>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <strong className="text-slate-700 font-bold">Secure Admin Access</strong> — This portal is restricted to authorized administrators only. All sessions are encrypted and monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}