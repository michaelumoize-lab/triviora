import HeroSection from "@/components/Landing/HeroSection";
import FeaturesSection from "@/components/Landing/FeaturesSection";
import HowItWorks from "@/components/Landing/HowItWorks";
import Footer from "@/components/Landing/Footer";
import CtaSection from "@/components/Landing/CtaSection";
import Testimonials from "@/components/Landing/Testimonials";
import Navbar from "@/components/Landing/LandingNavbar";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <CtaSection />
      <Footer />
    </div>
  );
}
