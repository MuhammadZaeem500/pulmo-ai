import HeroSection from "@/components/landing/HeroSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import PowerfulFeatures from "@/components/landing/PowerfulFeatures";
import HowItWorks from "@/components/landing/HowItWorks";
import NearbySpecialists from "@/components/landing/NearbySpecialists";
import Testimonials from "@/components/landing/Testimonials";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  // Move console.log here, right before the return statement
  console.log("COMPONENT CHECK:", {
    HeroSection: typeof HeroSection,
    WhyChooseUs: typeof WhyChooseUs,
    PowerfulFeatures: typeof PowerfulFeatures,
    HowItWorks: typeof HowItWorks,
    NearbySpecialists: typeof NearbySpecialists,
    Testimonials: typeof Testimonials,
    CtaSection: typeof CtaSection,
    Footer: typeof Footer,
  });

  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <WhyChooseUs />
      <PowerfulFeatures />
      <HowItWorks />
      <NearbySpecialists />
      <Testimonials />
      <CtaSection />
      <Footer />
    </main>
  );
}