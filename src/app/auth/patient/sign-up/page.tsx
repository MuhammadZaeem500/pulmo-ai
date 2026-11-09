"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, User, Mail, Phone, Lock, Calendar } from "lucide-react";
import AuthHeroBanner from "@/components/patient/AuthHeroBanner";
import { authService } from "@/services/auth.service";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    gender: "",
    bloodGroup: "O_POS",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await authService.signupPatient({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender as "MALE" | "FEMALE" | "OTHER",
        bloodGroup: formData.bloodGroup as any,
        password: formData.password,
      });
      alert(
        "Account created successfully! Please check your email to verify your account.",
      );
      router.push("/auth/patient/sign-in");
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full bg-white font-sans">
      <AuthHeroBanner />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-white w-full overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              {" "}
              <div className="p-1.5 bg-linear-to-br from-[#2F80ED] to-[#14B8A6] rounded-lg">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-base bg-linear-to-r from-[#2F80ED] to-[#14B8A6] bg-clip-text text-transparent">
                PulmoAI
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl mb-2 font-extrabold text-slate-900 tracking-tight">
              Create your account
            </h1>
            <p className="text-gray-500 text-xs">
              Join us and start your healthcare journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] mb-0.5 text-gray-700 font-bold uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 text-slate-900 text-xs bg-slate-50/50"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] mb-0.5 text-gray-700 font-bold uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 text-slate-900 text-xs bg-slate-50/50"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] mb-0.5 text-gray-700 font-bold uppercase tracking-wider">
                  Age
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 text-slate-900 text-xs bg-slate-50/50"
                    placeholder="25"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] mb-0.5 text-gray-700 font-bold uppercase tracking-wider">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 text-slate-900 text-xs bg-slate-50/50"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] mb-0.5 text-gray-700 font-bold uppercase tracking-wider">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 text-slate-900 text-xs bg-slate-50/50"
                  required
                >
                  <option value="A_POS">A+</option>
                  <option value="A_NEG">A-</option>
                  <option value="B_POS">B+</option>
                  <option value="B_NEG">B-</option>
                  <option value="AB_POS">AB+</option>
                  <option value="AB_NEG">AB-</option>
                  <option value="O_POS">O+</option>
                  <option value="O_NEG">O-</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] mb-0.5 text-gray-700 font-bold uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 text-slate-900 text-xs bg-slate-50/50"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] mb-0.5 text-gray-700 font-bold uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 text-slate-900 text-xs bg-slate-50/50"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] mb-0.5 text-gray-700 font-bold uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 text-slate-900 text-xs bg-slate-50/50"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-linear-to-r from-[#2F80ED] to-[#14B8A6] text-white font-bold text-xs rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-[#2F80ED]/20 cursor-pointer mt-2"
            >
              Create Account
            </button>

            <p className="text-center text-xs text-gray-500 pt-1">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/patient/sign-in")}
                className="text-[#2F80ED] hover:underline font-bold"
              >
                Sign In
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
