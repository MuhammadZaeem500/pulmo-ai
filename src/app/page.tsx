// src/app/page.tsx
import HeroSection from "@/src/components/landing/heroSection";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      {/* Add your other landing page sections below (e.g. Features, Testimonials, Footer) */}
    </main>
  );
}