import HeroSection from "@/src/components/landing/HeroSection";
import WhyChooseUs from "@/src/components/landing/WhyChooseUs";
import PowerfulFeatures from "@/src/components/landing/PowerfulFeatures";
import HowItWorks from "@/src/components/landing/HowItWorks";
import NearbySpecialists from "@/src/components/landing/NearbySpecialists";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <WhyChooseUs />
      <PowerfulFeatures />
      <HowItWorks />
      <NearbySpecialists />
    </main>
  );
}