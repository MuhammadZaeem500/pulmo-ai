"use client";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";

const NAV_LINKS = [{ label: "Doctor Portal" }, { label: "Login" }];

const STATS = [
  { value: "50K+", label: "Active Users" },
  { value: "95%", label: "Satisfaction" },
  { value: "24/7", label: "AI Support" },
];

// Bar heights for the "Symptoms Tracked" sparkline — purely decorative data.
const TRACKED_BARS = [24, 56, 32, 68, 28, 74, 26];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#3f6fe0] via-[#4a7fd6] to-[#3fb8a8]">
      {/* subtle dot texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden
      />
      {/* faint decorative rings, right side */}
      <div
        className="pointer-events-none absolute -right-10 top-10 h-72 w-72 rounded-full border border-white/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-24 top-24 h-40 w-40 rounded-full border border-white/10"
        aria-hidden
      />

      {/* Top nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-teal-400 text-white shadow-sm">
            <AutoAwesomeIcon fontSize="small" />
          </span>
          <span className="text-xl font-bold text-white">
            Pulmo<span className="text-sky-200">AI</span>
          </span>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href="#"
              className="text-[15px] font-medium text-white/90 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button
          variant="contained"
          sx={{
            bgcolor: "white",
            color: "#2f5fd6",
            px: 3,
            py: 1,
            fontWeight: 600,
            "&:hover": { bgcolor: "#f3f6ff" },
          }}
        >
          Get Started
        </Button>
      </header>

      {/* Hero content */}
      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-6 pb-20 pt-6 lg:grid-cols-2 lg:gap-10 lg:px-10 lg:pt-14">
        {/* Left column */}
        <div className="flex flex-col justify-center">
          <div className="mb-7 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur-sm">
            <AutoAwesomeIcon sx={{ fontSize: 16 }} className="text-emerald-300" />
            AI-Powered Pulmonary Health Platform
          </div>

          <h1 className="text-5xl font-extrabold leading-[1.08] text-white sm:text-6xl">
            Breathe Better,
            <br />
            <span className="text-sky-100/90">Live Healthier</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/85">
            Advanced AI-powered pulmonary care at your fingertips. Get instant
            respiratory symptom analysis, lung health insights, and connect
            with pulmonary specialists for comprehensive care.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: "white",
                color: "#2f5fd6",
                px: 3.5,
                py: 1.6,
                fontSize: "1rem",
                fontWeight: 700,
                "&:hover": { bgcolor: "#f3f6ff" },
              }}
            >
              Get Started Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<MedicalServicesOutlinedIcon />}
              sx={{
                borderColor: "rgba(255,255,255,0.6)",
                color: "white",
                px: 3.5,
                py: 1.6,
                fontSize: "1rem",
                fontWeight: 700,
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              Book Consultation
            </Button>
          </div>

          {/* Stats row */}
          <div className="mt-12 grid max-w-lg grid-cols-3 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/10 px-4 py-4 text-center ring-1 ring-white/15 backdrop-blur-sm"
              >
                <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-white/75">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — dashboard preview card */}
        <div className="flex items-center">
          <div className="w-full rounded-3xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur-md sm:p-6">
            {/* AI symptom analysis card */}
            <div className="rounded-2xl bg-white/15 p-5 ring-1 ring-white/15">
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/25 text-white">
                  <PsychologyOutlinedIcon />
                </span>
                <div>
                  <p className="text-sm text-white/75">AI Symptom Analysis</p>
                  <p className="font-semibold text-white">
                    Analyzing respiratory patterns...
                  </p>
                </div>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-4/5 rounded-full bg-white" />
              </div>
            </div>

            {/* Active chats / records */}
            <div className="mt-5 grid grid-cols-2 gap-5">
              <div className="rounded-2xl bg-white/15 p-5 ring-1 ring-white/15">
                <ChatBubbleOutlineIcon className="text-sky-100" />
                <p className="mt-3 text-sm text-white/75">Active Chats</p>
                <p className="text-2xl font-extrabold text-white">1,234</p>
              </div>
              <div className="rounded-2xl bg-white/15 p-5 ring-1 ring-white/15">
                <DescriptionOutlinedIcon className="text-sky-100" />
                <p className="mt-3 text-sm text-white/75">Records</p>
                <p className="text-2xl font-extrabold text-white">5,678</p>
              </div>
            </div>

            {/* Symptoms tracked sparkline */}
            <div className="mt-5 rounded-2xl bg-white/15 p-5 ring-1 ring-white/15">
              <div className="flex items-center justify-between">
                <p className="font-medium text-white">Symptoms Tracked</p>
                <p className="text-sm text-white/70">This Month</p>
              </div>
              <div className="mt-4 flex h-16 items-end gap-2">
                {TRACKED_BARS.map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-md ${
                      i % 2 === 1 ? "bg-sky-100/90" : "bg-white/25"
                    }`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help button */}
      <IconButton
        sx={{
          position: "fixed",
          right: 24,
          bottom: 24,
          bgcolor: "#1c2b45",
          color: "white",
          "&:hover": { bgcolor: "#132038" },
        }}
        aria-label="Help"
      >
        <HelpOutlineIcon />
      </IconButton>
    </section>
  );
}
