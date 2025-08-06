import AOS from 'aos';
import { FC, useEffect } from 'react';
import 'aos/dist/aos.css'; // Import the AOS CSS
import StatSection from '../components/landing/StatSection';
import HeroSection from '../components/landing/HeroSection';
import HeaderSection from '../components/landing/HeaderSection';
import FooterSection from '../components/landing/FooterSection';
import FeaturesSection from '../components/landing/FeatureSection';
import DashboardPreviewSection from '../components/landing/DashboardPreviewSection';
const LandingPage: FC = () => {
  useEffect(() => {
    AOS.init({
      easing:"ease-in-out",
      mirror:true,
      duration: 1000,
      once: true,
    });
    AOS.refresh();
  }, []);
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 scroll-smooth transition-all snap-y snap-mandatory">
      <HeaderSection />
      <HeroSection
        children={<DashboardPreviewSection />}
      />
      <FeaturesSection />
      <StatSection />
      <FooterSection />
    </div>
  );
}
export default LandingPage;
