"use client";

import { useState } from "react";
import Link from "next/link";

import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const NAV_LINKS = [
  {
    label: "Doctor Portal",
    href: "/doctor",
  },
  {
    label: "Login",
    href: "/login",
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="absolute left-0 pb-'100px' top-0 z-50 w-full bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-teal-400 shadow-lg">
              <AutoAwesomeIcon fontSize="small" sx={{ color: "white" }} />
            </span>

            <h2 className="text-xl font-bold">
              <span className="bg-gradient-to-r from-sky-400 to-teal-400 bg-clip-text text-transparent">
                Pulmo
              </span>
              <span className="text-sky-200">AI</span>
            </h2>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[15px] font-medium text-black/90 transition hover:text-black"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Button */}
          <div className="hidden md:block">
            <Button
              variant="contained"
              sx={{
                bgcolor: "white",
                color: "#3366dd",
                px: 3.5,
                py: 1,
                borderRadius: "999px",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#f5f5f5",
                },
              }}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu */}
          <IconButton
            className="md:hidden"
            onClick={() => setOpen(true)}
            sx={{ color: "white" }}
          >
            <MenuIcon />
          </IconButton>
        </div>
      </header>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              background: "linear-gradient(180deg,#3f6fe0,#3fb8a8)",
              color: "white",
            },
          },
        }}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <h2 className="text-xl font-bold">
            Pulmo
            <span className="text-sky-200">AI</span>
          </h2>

          <IconButton sx={{ color: "white" }} onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </div>

        <nav className="mt-8 flex flex-col gap-2 px-5">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-lg transition hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              bgcolor: "white",
              color: "#3366dd",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "999px",
              "&:hover": {
                bgcolor: "#f5f5f5",
              },
            }}
          >
            Get Started
          </Button>
        </nav>
      </Drawer>
    </>
  );
}
