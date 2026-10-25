// src/app/(auth)/admin/sign-up/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Stethoscope, Eye, EyeOff, ArrowLeft } from "lucide-react";
import AuthHeroBanner from "@/components/admin/auth/AuthHeroBanner";

export default function AdminSignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organization: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert("You must agree to the Terms of Service and Privacy Policy");
      return;
    }
    alert(`Creating admin account for: ${formData.email}`);
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans overflow-hidden">
      {/* Reusable Hero Banner */}
      <AuthHeroBanner />

      {/* Right Sign-Up Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-white overflow-y-auto max-h-screen">
        <div className="w-full max-w-md space-y-6">
          {/* Back to login link */}
          <Link href="/auth/admin/sign-in" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white lg:hidden">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create an account</h2>
            </div>
            <p className="text-xs text-slate-400 font-medium">Register as an administrator to access the platform.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Sarah Chen"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="sarah@hospital.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block mb-1.5">
                Organization / Institution
              </label>
              <input
                type="text"
                required
                placeholder="Metro General Hospital"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block mb-1.5">
                Admin Role
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="">Select a role</option>
                <option value="super-admin">Super Administrator</option>
                <option value="clinical-admin">Clinical Administrator</option>
                <option value="it-security">IT & Security Administrator</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
              />
              <span className="font-medium text-slate-600">
                I agree to the <a href="#" className="text-blue-600 font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 font-semibold hover:underline">Privacy Policy</a>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              Create Account
            </button>

            <p className="text-center text-xs text-slate-500">
              Already have an account?{" "}
              <Link href="/auth/admin/sign-in" className="font-bold text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}