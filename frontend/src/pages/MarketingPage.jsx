import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../features/marketing/Navbar.jsx";
import Hero from "../features/marketing/Hero.jsx";
import SocialProof from "../features/marketing/SocialProof.jsx";
import ProductIntro from "../features/marketing/ProductIntro.jsx";
import Features from "../features/marketing/Features.jsx";
import HowItWorks from "../features/marketing/HowItWorks.jsx";
import AIDemo from "../features/marketing/AIDemo.jsx";
import Integrations from "../features/marketing/Integrations.jsx";
import Testimonials from "../features/marketing/Testimonials.jsx";
import Pricing from "../features/marketing/Pricing.jsx";
import FAQ from "../features/marketing/FAQ.jsx";
import FinalCTA from "../features/marketing/FinalCTA.jsx";
import Footer from "../features/marketing/Footer.jsx";

export default function MarketingPage() {
  const location = useLocation();

  // Handles both "arrive on / already scrolled to a hash" and "click an
  // anchor link while already on /", since a hash-only navigate() doesn't
  // remount this page or trigger a native browser scroll on its own.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
    return () => clearTimeout(timer);
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <ProductIntro />
        <Features />
        <HowItWorks />
        <AIDemo />
        <Integrations />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
