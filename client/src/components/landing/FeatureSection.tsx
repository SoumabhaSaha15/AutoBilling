import { HiDocumentText, HiUsers, HiShieldCheck, HiClock, HiStar, HiCreditCard, } from 'react-icons/hi';
import { Card } from 'flowbite-react';
const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <HiCreditCard className="h-8 w-8" />,
      title: "Automated Billing",
      description: "Generate and send invoices automatically based on your billing cycles and tenant agreements."
    },
    {
      icon: <HiDocumentText className="h-8 w-8" />,
      title: "Payment Tracking",
      description: "Monitor all payments in real-time with detailed transaction history and payment status."
    },
    {
      icon: <HiUsers className="h-8 w-8" />,
      title: "Tenant Management",
      description: "Comprehensive tenant profiles with lease details, contact information, and billing history."
    },
    {
      icon: <HiShieldCheck className="h-8 w-8" />,
      title: "Secure & Compliant",
      description: "Bank-grade security with full compliance to financial regulations and data protection laws."
    },
    {
      icon: <HiClock className="h-8 w-8" />,
      title: "Real-time Reports",
      description: "Generate detailed financial reports and analytics to track your mall's performance."
    },
    {
      icon: <HiStar className="h-8 w-8" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support to ensure your billing operations run smoothly."
    }
  ];
  return (
    <section id="features" className="py-20 dark:bg-gray-900 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-300 mb-4">
            Everything You Need to Manage Your Mall
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From tenant management to payment processing, our comprehensive platform handles all your billing needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow dark:hover:shadow-gray-800">
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-300">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
export default FeaturesSection;