import Link from "next/link";
import { Stethoscope, Sparkles, ArrowRight, Activity, FileText, MessageSquare } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 text-white overflow-hidden flex flex-col">
      
      {/* ================= STICKY NAVBAR ================= */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
              <Activity className="h-6 w-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              Pulmo<span className="text-teal-500">AI</span>
            </span>
          </Link>

          {/* Right Navigation & Actions */}
          <div className="flex items-center gap-6">
            <Link 
              href="/auth/doctor/sign-in" 
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition hidden sm:block"
            >
              Doctor Portal
            </Link>
            <Link 
              href="/auth/patient/sign-in" 
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link 
              href="/auth/patient/sign-up" 
              className="rounded-full bg-gradient-to-r from-teal-400 to-teal-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 hover:from-teal-500 hover:to-teal-600 transition transform hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO CONTENT & DASHBOARD PREVIEW ================= */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-20 my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        
        {/* Left Column: Text & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md border border-white/20 shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-teal-300" />
            <span>AI-Powered Pulmonary Health Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] mb-6">
            Breathe Better, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-teal-100 to-white">
              Live Healthier
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-blue-100/90 font-normal leading-relaxed mb-8 max-w-xl">
            Advanced AI-powered pulmonary care at your fingertips. Get instant respiratory symptom analysis, lung health insights, and connect with pulmonary specialists for comprehensive care.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <Link
              href="/auth/patient/sign-up"
              className="group rounded-xl bg-white px-7 py-4 text-sm font-bold text-blue-700 shadow-xl shadow-black/10 hover:bg-blue-50 transition flex items-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/clinic-finder"
              className="rounded-xl bg-white/10 border border-white/30 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20 transition flex items-center gap-2"
            >
              <Stethoscope className="h-4 w-4 text-teal-300" />
              <span>Book Consultation</span>
            </Link>
          </div>

          {/* Bottom Stat Cards */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full max-w-lg border-t border-white/15 pt-8">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">50K+</p>
              <p className="text-xs sm:text-sm text-blue-200 font-medium">Active Users</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">95%</p>
              <p className="text-xs sm:text-sm text-blue-200 font-medium">Satisfaction</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">24/7</p>
              <p className="text-xs sm:text-sm text-blue-200 font-medium">AI Support</p>
            </div>
          </div>

        </div>

        {/* Right Column: Glassmorphism Dashboard Preview Card */}
        <div className="lg:col-span-5 relative w-full flex justify-center">
          
          {/* Decorative Glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-teal-400 to-blue-500 opacity-30 blur-2xl"></div>

          {/* Main Card Container */}
          <div className="relative w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-2xl shadow-blue-900/40 text-white">
            
            {/* Top Widget: AI Symptom Analysis */}
            <div className="rounded-2xl bg-white/15 border border-white/10 p-4 mb-4 backdrop-blur-md">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="h-8 w-8 rounded-lg bg-teal-400/20 flex items-center justify-center text-teal-300">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-blue-200 font-medium">AI Symptom Analysis</p>
                  <p className="text-sm font-semibold tracking-wide">Analyzing respiratory patterns...</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-teal-300 to-teal-400 h-full rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>

            {/* Middle Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              
              {/* Active Chats Card */}
              <div className="rounded-2xl bg-white/15 border border-white/10 p-4 backdrop-blur-md">
                <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-200 mb-2">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <p className="text-xs text-blue-200 font-medium">Active Chats</p>
                <p className="text-2xl font-bold tracking-tight">1,234</p>
              </div>

              {/* Records Card */}
              <div className="rounded-2xl bg-white/15 border border-white/10 p-4 backdrop-blur-md">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-200 mb-2">
                  <FileText className="h-4 w-4" />
                </div>
                <p className="text-xs text-blue-200 font-medium">Records</p>
                <p className="text-2xl font-bold tracking-tight">5,678</p>
              </div>

            </div>

            {/* Bottom Widget: Symptoms Tracked */}
            <div className="rounded-2xl bg-white/15 border border-white/10 p-4 backdrop-blur-md">
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs font-semibold text-white">Symptoms Tracked</p>
                <span className="text-[10px] text-blue-200 font-medium bg-white/10 px-2 py-0.5 rounded-full">This Month</span>
              </div>
              {/* Mini Bar Chart Preview */}
              <div className="flex items-end justify-between gap-2 h-10 pt-2">
                <div className="w-full bg-white/20 h-4 rounded-t-sm"></div>
                <div className="w-full bg-white/30 h-6 rounded-t-sm"></div>
                <div className="w-full bg-white/20 h-5 rounded-t-sm"></div>
                <div className="w-full bg-teal-300 h-9 rounded-t-sm shadow-sm shadow-teal-300/50"></div>
                <div className="w-full bg-white/30 h-7 rounded-t-sm"></div>
                <div className="w-full bg-white/20 h-6 rounded-t-sm"></div>
                <div className="w-full bg-white/40 h-8 rounded-t-sm"></div>
                <div className="w-full bg-white/20 h-5 rounded-t-sm"></div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}