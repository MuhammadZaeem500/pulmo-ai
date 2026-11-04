import Link from "next/link";
import { Sparkles, CheckCircle2 } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 text-white overflow-hidden text-center">
      
     
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8 flex flex-col items-center">
        
       
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md border border-white/20 shadow-inner">
          <Sparkles className="h-3.5 w-3.5 text-teal-300" />
          <span>Start Your Journey</span>
        </div>

       
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.1] mb-6 max-w-3xl">
          Ready to Transform Your Pulmonary Health?
        </h2>

       
        <p className="text-base sm:text-lg text-blue-100/90 font-normal leading-relaxed mb-10 max-w-xl">
          Join thousands of patients who trust PulmoAI for their respiratory health management
        </p>

       
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link
            href="/auth/patient/sign-up"
            className="rounded-xl bg-white px-7 py-4 text-sm font-bold text-blue-700 shadow-xl shadow-black/10 hover:bg-blue-50 transition transform hover:-translate-y-0.5"
          >
            Get Started Today
          </Link>
          <Link
            href="/clinic-finder"
            className="rounded-xl bg-white/10 border border-white/30 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20 transition transform hover:-translate-y-0.5"
          >
            Schedule Consultation
          </Link>
        </div>

       
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-blue-100 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-teal-300" />
            <span>Easy registration</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-teal-300" />
            <span>AI-powered insights</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-teal-300" />
            <span>Expert specialists</span>
          </div>
        </div>

      </div>

    </section>
  );
}