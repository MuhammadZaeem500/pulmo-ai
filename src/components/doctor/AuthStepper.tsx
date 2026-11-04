import React from "react";
import { Check } from "lucide-react";
import AuthStepperProps from "@/types/doctor.types";


export default function AuthStepper({ currentStep }: AuthStepperProps) {
  return (
    <div className="flex items-center justify-between my-8 max-w-xs">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              currentStep === s
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-4 ring-blue-50"
                : currentStep > s
                ? "bg-teal-500 text-white"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            {currentStep > s ? <Check className="w-4 h-4" /> : s}
          </div>
          {s < 4 && (
            <div
              className={`w-12 h-0.5 mx-1 ${
                currentStep > s ? "bg-teal-500" : "bg-slate-100"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}