import { FC } from 'react';
import StatSection from '../components/landing/StatSection';
import HeroSection from '../components/landing/HeroSection';
import HeaderSection from '../components/landing/HeaderSection';
import FooterSection from '../components/landing/FooterSection';
import FeaturesSection from '../components/landing/FeatureSection';
import DashboardPreviewSection from '../components/landing/DashboardPreviewSection';
const LandingPage: FC = () => {
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
