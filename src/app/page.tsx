import HeroSection from "@/components/landing/HeroSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import PowerfulFeatures from "@/components/landing/PowerfulFeatures";
import HowItWorks from "@/components/landing/HowItWorks";
import NearbySpecialists from "@/components/landing/NearbySpecialists";
import Testimonials from "@/components/landing/Testimonials";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";


export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <WhyChooseUs />
      <PowerfulFeatures />
      <HowItWorks />
      <NearbySpecialists />
      {/* <Testimonials /> */}
      {/* <CtaSection /> */}
      {/* <Footer /> */}
      
    </main>

    
  );
}