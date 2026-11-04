"use client";

import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { Stethoscope, ArrowLeft, Eye, EyeOff } from "lucide-react";
import AuthHeroBanner from "@/components/doctor/AuthHeroBanner";

export default function DoctorLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDemoAccess = () => {
    setFormData({
      email: "doctor@hospital.com",
      password: "demopassword123",
      rememberMe: true,
    });
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.user && response.user.role && response.user.role !== "DOCTOR") {
        setError("Access denied. This portal is for doctors only.");
        setLoading(false);
        return;
      }

      router.push("/doctor/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans overflow-hidden">
     
      <AuthHeroBanner />

     
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 overflow-y-auto max-h-screen">
        <div>
         
          <div className="flex flex-col items-start gap-3 mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Patient Portal
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">
              <Stethoscope className="w-3.5 h-3.5" />
              Doctor Portal
            </div>
          </div>

         <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back, Doctor
          </h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Sign in to access your patient management dashboard.
          </p>

          {error && (
            <div className="mb-4 max-w-md p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="doctor@hospital.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

           
            <div className="flex items-center justify-between text-xs py-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-600 font-medium">Keep me signed in</span>
              </label>
              <Link
                href="/auth/doctor/forgot-password"
                className="text-blue-600 font-semibold hover:underline"
              >
                Forgot password?
              </Link>
            </div>

           
           <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In to Doctor Portal"}
            </button>
          </form>
          

         
          <div className="mt-6 max-w-md flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <span>New doctor?</span>
            <Link
              href="/auth/doctor/sign-up"
              className="text-blue-600 font-semibold hover:underline"
            >
              Register here
            </Link>
          </div>

         
          <div
            onClick={handleDemoAccess}
            className="mt-8 max-w-md p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                Demo Access
              </span>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                Quick Fill
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Click here to auto-fill demo credentials and test the portal instantly.
            </p>
          </div>
        </div>

       
        <div className="mt-8" />
      </div>
    </div>
  );
}