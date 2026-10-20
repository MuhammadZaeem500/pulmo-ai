// src/app/page.tsx
import HeroSection from "@/src/components/landing/heroSection";
import WhyChooseUs from "@/src/components/landing/WhyChooseUs";
import PowerfulFeatures from "@/src/components/landing/PowerfulFeatures";
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <WhyChooseUs />
      <PowerfulFeatures />
    </main>
  );
}