import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import ServicesSection from "@/components/sections/ServicesSection";
import WhyUs from "@/components/sections/WhyUs";
import CTASection from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ServicesSection />
        <WhyUs />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
