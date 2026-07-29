"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const NAV_LINKS = [{ label: "Doctor Portal" }, { label: "Login" }];

const STATS = [
  { value: "50K+", label: "Active Users" },
  { value: "95%", label: "Satisfaction" },
  { value: "24/7", label: "AI Support" },
];

const TRACKED_BARS = [24, 56, 32, 68, 28, 74, 26];

export default function Hero() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
      {/* faint decorative rings, right side — hidden on small screens where they'd just clip */}
      <div
        className="pointer-events-none absolute -right-10 top-10 hidden h-72 w-72 rounded-full border border-white/10 sm:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-24 top-24 hidden h-40 w-40 rounded-full border border-white/10 sm:block"
        aria-hidden
      />

      {/* Top nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5 lg:px-10">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-teal-400 text-white shadow-sm sm:h-10 sm:w-10">
            <AutoAwesomeIcon fontSize="small" />
          </span>
          <span className="text-lg font-bold text-white sm:text-xl">
            Pulmo<span className="text-sky-200">AI</span>
          </span>
        </div>

        {/* Desktop nav links */}
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

        <div className="flex items-center gap-2">
          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: "white",
              color: "#2f5fd6",
              px: { xs: 2, sm: 3 },
              py: { xs: 0.75, sm: 1 },
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              fontWeight: 600,
              whiteSpace: "nowrap",
              "&:hover": { bgcolor: "#f3f6ff" },
            }}
          >
            Get Started
          </Button>

          {/* Mobile menu toggle */}
          <IconButton
            className="md:hidden"
            onClick={() => setMobileNavOpen(true)}
            sx={{ color: "white" }}
            aria-label="Open menu"
          >
            <MenuIcon />
          </IconButton>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <Drawer
        anchor="right"
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#2f5fd6",
              color: "white",
              width: "min(80vw, 320px)",
            },
          },
        }}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-lg font-bold text-white">
            Pulmo<span className="text-sky-200">AI</span>
          </span>
          <IconButton
            onClick={() => setMobileNavOpen(false)}
            sx={{ color: "white" }}
            aria-label="Close menu"
          >
            <CloseIcon />
          </IconButton>
        </div>
        <nav className="flex flex-col gap-1 px-5 py-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href="#"
              className="rounded-lg px-3 py-3 text-base font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              onClick={() => setMobileNavOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </Drawer>

      {/* Hero content */}
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-4 sm:gap-14 sm:px-6 sm:pb-20 sm:pt-6 lg:grid-cols-2 lg:gap-10 lg:px-10 lg:pt-14">
        {/* Left column */}
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-medium text-white ring-1 ring-white/20 backdrop-blur-sm sm:mb-7 sm:px-4 sm:py-2 sm:text-sm">
            <AutoAwesomeIcon sx={{ fontSize: 16 }} className="text-emerald-300" />
            AI-Powered Pulmonary Health Platform
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl sm:leading-[1.08] lg:text-6xl">
            Breathe Better,
            <br />
            <span className="text-sky-100/90">Live Healthier</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:mt-7 sm:text-lg">
            Advanced AI-powered pulmonary care at your fingertips. Get instant
            respiratory symptom analysis, lung health insights, and connect
            with pulmonary specialists for comprehensive care.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Button
              variant="contained"
              size="large"
              fullWidth
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: "white",
                color: "#2f5fd6",
                px: 3.5,
                py: { xs: 1.3, sm: 1.6 },
                fontSize: { xs: "0.95rem", sm: "1rem" },
                fontWeight: 700,
                width: { xs: "100%", sm: "auto" },
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
                py: { xs: 1.3, sm: 1.6 },
                fontSize: { xs: "0.95rem", sm: "1rem" },
                fontWeight: 700,
                width: { xs: "100%", sm: "auto" },
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
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-2.5 sm:mt-12 sm:gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white/10 px-2 py-3 text-center ring-1 ring-white/15 backdrop-blur-sm sm:rounded-2xl sm:px-4 sm:py-4"
              >
                <p className="text-lg font-extrabold text-white sm:text-2xl">{stat.value}</p>
                <p className="mt-0.5 text-[11px] text-white/75 sm:mt-1 sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — dashboard preview card */}
        <div className="flex items-center">
          <div className="w-full rounded-2xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur-md sm:rounded-3xl sm:p-5 lg:p-6">
            {/* AI symptom analysis card */}
            <div className="rounded-2xl bg-white/15 p-4 ring-1 ring-white/15 sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/25 text-white sm:h-11 sm:w-11">
                  <PsychologyOutlinedIcon />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-white/75 sm:text-sm">AI Symptom Analysis</p>
                  <p className="truncate text-sm font-semibold text-white sm:text-base">
                    Analyzing respiratory patterns...
                  </p>
                </div>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-4/5 rounded-full bg-white" />
              </div>
            </div>

            {/* Active chats / records */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-5">
              <div className="rounded-2xl bg-white/15 p-4 ring-1 ring-white/15 sm:p-5">
                <ChatBubbleOutlineIcon className="text-sky-100" />
                <p className="mt-2 text-xs text-white/75 sm:mt-3 sm:text-sm">Active Chats</p>
                <p className="text-xl font-extrabold text-white sm:text-2xl">1,234</p>
              </div>
              <div className="rounded-2xl bg-white/15 p-4 ring-1 ring-white/15 sm:p-5">
                <DescriptionOutlinedIcon className="text-sky-100" />
                <p className="mt-2 text-xs text-white/75 sm:mt-3 sm:text-sm">Records</p>
                <p className="text-xl font-extrabold text-white sm:text-2xl">5,678</p>
              </div>
            </div>

            {/* Symptoms tracked sparkline */}
            <div className="mt-4 rounded-2xl bg-white/15 p-4 ring-1 ring-white/15 sm:mt-5 sm:p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white sm:text-base">Symptoms Tracked</p>
                <p className="text-xs text-white/70 sm:text-sm">This Month</p>
              </div>
              <div className="mt-3 flex h-14 items-end gap-1.5 sm:mt-4 sm:h-16 sm:gap-2">
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
          right: { xs: 16, sm: 24 },
          bottom: { xs: 16, sm: 24 },
          bgcolor: "#1c2b45",
          color: "white",
          zIndex: 20,
          "&:hover": { bgcolor: "#132038" },
        }}
        aria-label="Help"
      >
        <HelpOutlineIcon />
      </IconButton>
    </section>
  );
}