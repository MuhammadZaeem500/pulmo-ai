"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Stethoscope, ArrowLeft, Eye, EyeOff, ChevronRight, Upload, ShieldCheck } from "lucide-react";
import AuthHeroBanner from "@/components/doctor/AuthHeroBanner";
import AuthStepper from "@/components/doctor/AuthStepper";

export default function DoctorRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    specialty: "",
    hospital: "",
    pmdcNumber: "",
    medicalRegNumber: "",
    qualifications: "",
    experience: "",
    cnicFront: null as File | null,
    cnicBack: null as File | null,
    practiceLicense: null as File | null,
    pmdcCertificate: null as File | null,
    otp: ["", "", "", "", "", ""],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData({ ...formData, [field]: file });
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData({ ...formData, otp: newOtp });
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) setStep(step + 1);
    else alert("Registration submitted successfully!");
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans overflow-hidden">
      {/* Left Banner Component */}
      <AuthHeroBanner />

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 overflow-y-auto max-h-screen">
        <div>
          <div className="flex flex-col items-start gap-3 mb-6">
            <Link
              href="/auth/doctor/sign-in"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">
              <Stethoscope className="w-3.5 h-3.5" />
              Doctor Registration
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Create Doctor Account
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {step === 1 && "Start with your personal information."}
            {step === 2 && "Enter your professional credentials."}
            {step === 3 && "Upload your verification documents."}
            {step === 4 && `Enter the 6-digit OTP sent to ${formData.phone || "+923414009812"}`}
          </p>

          {/* Stepper Component */}
          <AuthStepper currentStep={step} />

          <form onSubmit={handleContinue} className="space-y-4 max-w-md">
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">First Name *</label>
                    <input type="text" name="firstName" required placeholder="Sarah" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Last Name *</label>
                    <input type="text" name="lastName" required placeholder="Mitchell" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address *</label>
                  <input type="email" name="email" required placeholder="doctor@hospital.com" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number *</label>
                  <input type="tel" name="phone" required placeholder="+92 300 0000000" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password *</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} name="password" required placeholder="Min. 8 characters" value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50 pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm Password *</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" required placeholder="Re-enter password" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50 pr-10" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Specialty *</label>
                  <select name="specialty" required value={formData.specialty} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50">
                    <option value="">Select your specialty...</option>
                    <option value="Pulmonologist">Pulmonologist</option>
                    <option value="Respiratory Specialist">Respiratory Specialist</option>
                    <option value="Chest Physician">Chest Physician</option>
                    <option value="Intensivist / Critical Care">Intensivist / Critical Care</option>
                    <option value="General Physician">General Physician</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Paediatric Pulmonologist">Paediatric Pulmonologist</option>
                    <option value="Thoracic Surgeon">Thoracic Surgeon</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hospital / Clinic Affiliation *</label>
                  <input type="text" name="hospital" required placeholder="e.g. Aga Khan University Hospital" value={formData.hospital} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">PMDC Registration Number *</label>
                  <input type="text" name="pmdcNumber" required placeholder="e.g. PMDC-12345-M" value={formData.pmdcNumber} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50" />
                  <p className="text-[11px] text-slate-400 mt-1">As shown on your PMDC registration certificate.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Medical Registration Number <span className="text-slate-400 font-normal">(optional)</span></label>
                  <input type="text" name="medicalRegNumber" placeholder="Provincial / National reg. number" value={formData.medicalRegNumber} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Qualifications</label>
                  <input type="text" name="qualifications" placeholder="e.g. MBBS, FCPS, MD, MRCP" value={formData.qualifications} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Years of Experience</label>
                  <input type="number" name="experience" placeholder="e.g. 8" value={formData.experience} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50" />
                </div>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-800 text-xs leading-relaxed">
                  <span className="font-semibold">Verification required.</span> All documents are encrypted and reviewed by our medical compliance team within 24–48 hours. Accepted formats: JPG, PNG, PDF.
                </div>
                {[
                  { label: "CNIC — Front Side *", key: "cnicFront", desc: "Clear photo of your national ID (front)" },
                  { label: "CNIC — Back Side *", key: "cnicBack", desc: "Clear photo of your national ID (back)" },
                  { label: "Approved Medical Practice License *", key: "practiceLicense", desc: "Current, valid practice license issued by PMDC or provincial authority" },
                  { label: "PMDC Registration Certificate", key: "pmdcCertificate", desc: "Official PMDC certificate (optional but recommended)" },
                ].map((doc) => (
                  <div key={doc.key}>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">{doc.label}</label>
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl cursor-pointer bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600"><Upload className="w-5 h-5" /></div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">Click to upload</p>
                          <p className="text-[11px] text-slate-500">{doc.desc}</p>
                        </div>
                      </div>
                      <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleFileChange(doc.key, e.target.files?.[0] || null)} />
                    </label>
                  </div>
                ))}
              </>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 border border-blue-100">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">OTP sent to your phone</h3>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">{formData.phone || "+923414009812"}</p>
                  <p className="text-xs text-slate-400 mt-1">Also check your email: {formData.email || "zaeemsheikh102@gmail.com"}</p>
                </div>
                <div className="flex justify-between gap-2">
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={formData.otp[idx]}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      className="w-12 h-14 text-center text-lg font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50"
                    />
                  ))}
                </div>
                <div className="text-center text-xs text-slate-500">
                  Resend OTP in <span className="text-blue-600 font-semibold">26s</span>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <button type="button" onClick={handleBack} className="w-1/3 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
                  Back
                </button>
              )}
              <button type="submit" className={`${step > 1 ? "w-2/3" : "w-full"} py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25`}>
                {step === 4 ? "Verify & Submit" : "Continue"}
                {step < 4 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 w-full max-w-md flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <span>Already registered?</span>
          <Link href="/auth/doctor/sign-in" className="text-blue-600 font-semibold hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}