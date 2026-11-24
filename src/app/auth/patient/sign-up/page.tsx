"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, User, Mail, Phone, Lock, Calendar, Loader2 } from "lucide-react";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import axios from "axios";
import AuthHeroBanner from "@/components/patient/AuthHeroBanner";
import { authService } from "@/services/auth.service";

function getFirebaseClientAuth() {
  if (!getApps().length) {
    initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
  }
  return getAuth();
}

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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await authService.signupPatient({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        gender: formData.gender as "MALE" | "FEMALE" | "OTHER",
        bloodGroup: formData.bloodGroup,
        password: formData.password,
      });
      router.push("/patient/dashboard");
    } catch (err: any) {
      setError(authService.formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (providerType: "google" | "github") => {
    setError("");
    setSocialLoading(providerType);

    try {
      const auth = getFirebaseClientAuth();
      const provider =
        providerType === "google" ? new GoogleAuthProvider() : new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/auth/social-sync`,
        {
          email: result.user.email,
          fullName: result.user.displayName,
          idToken,
          role: "PATIENT",
          provider: providerType.toUpperCase(),
        },
      );

      if (data?.accessToken) {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("accessToken", data.accessToken);
      }

      router.push("/patient/dashboard");
    } catch (err: any) {
      setError(authService.formatAuthError(err));
    } finally {
      setSocialLoading(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isBusy = loading || socialLoading !== null;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full bg-white font-sans">
      <AuthHeroBanner />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-white w-full overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
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

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

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
              disabled={isBusy}
              className="w-full py-2.5 bg-linear-to-r from-[#2F80ED] to-[#14B8A6] text-white font-bold text-xs rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-[#2F80ED]/20 cursor-pointer mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />}
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
            </button>

            <div className="relative my-3 flex items-center">
              <div className="grow border-t border-gray-200" />
              <span className="mx-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Or continue with
              </span>
              <div className="grow border-t border-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleSocialSignIn("google")}
                disabled={isBusy}
                className="w-full py-2 px-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {socialLoading === "google" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2F80ED]" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                    />
                  </svg>
                )}
                <span>{socialLoading === "google" ? "Signing in..." : "Google"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialSignIn("github")}
                disabled={isBusy}
                className="w-full py-2 px-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {socialLoading === "github" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-900" />
                ) : (
                  <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
                    />
                  </svg>
                )}
                <span>{socialLoading === "github" ? "Signing in..." : "GitHub"}</span>
              </button>
            </div>

            <p className="text-center text-xs text-gray-500 pt-1">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/patient/sign-in")}
                className="text-[#2F80ED] hover:underline font-bold cursor-pointer"
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