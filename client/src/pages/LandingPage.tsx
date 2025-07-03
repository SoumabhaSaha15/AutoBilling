import { Card, Navbar, Footer, Badge, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, FooterLink, FooterBrand, FooterTitle, FooterLinkGroup, FooterDivider, FooterCopyright, DarkThemeToggle } from 'flowbite-react';
import React from 'react';
import { HiCreditCard, HiDocumentText, HiUsers, HiTrendingUp, HiShieldCheck, HiClock, HiStar, } from 'react-icons/hi';

export default function MallBillingPortal() {
  const [width, setWidth] = React.useState<number>(window.innerWidth);
  React.useEffect(() => {
    window.onresize = (_) => {
      setWidth(window.innerWidth);
    };
  }, []);
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

  const stats = [
    { number: "500+", label: "Shopping Malls" },
    { number: "50K+", label: "Tenants Managed" },
    { number: "99.9%", label: "Uptime" },
    { number: "$2B+", label: "Processed Revenue" }
  ];

  const dashboardMetrics = [
    { icon: <HiDocumentText className="h-5 w-5 text-white" />, label: "Monthly Revenue", value: "$2.4M" },
    { icon: <HiUsers className="h-5 w-5 text-white" />, label: "Active Tenants", value: "150" },
    { icon: <HiTrendingUp className="h-5 w-5 text-white" />, label: "Collection Rate", value: "98.5%" }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <Navbar fluid rounded className="bg-white shadow-sm sticky top-0 z-50">
        <NavbarToggle />
        <NavbarBrand href="#">
          <span className=" self-center whitespace-nowrap text-xl font-semibold text-gray-900 dark:text-gray-300">
            Auto Billing
          </span>
        </NavbarBrand>
        {(width < 768) ? (<>
          <DarkThemeToggle />
          <NavbarCollapse>
            <NavbarLink href="#features" className="text-gray-700 hover:text-blue-600">
              Features
            </NavbarLink>
            <NavbarLink href="#pricing" className="text-gray-700 hover:text-blue-600">
              Pricing
            </NavbarLink>
            <NavbarLink href="#about" className="text-gray-700 hover:text-blue-600">
              About
            </NavbarLink>
            <NavbarLink href="#contact" className="text-gray-700 hover:text-blue-600">
              Contact
            </NavbarLink>
          </NavbarCollapse>
        </>) : (<>
          <NavbarCollapse>
            <NavbarLink href="#features" className="text-gray-700 hover:text-blue-600">
              Features
            </NavbarLink>
            <NavbarLink href="#pricing" className="text-gray-700 hover:text-blue-600">
              Pricing
            </NavbarLink>
            <NavbarLink href="#about" className="text-gray-700 hover:text-blue-600">
              About
            </NavbarLink>
            <NavbarLink href="#contact" className="text-gray-700 hover:text-blue-600">
              Contact
            </NavbarLink>
          </NavbarCollapse>
          <DarkThemeToggle />
        </>)}
      </Navbar>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Streamline Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                  Auto Billing
                </span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Powerful billing portal designed specifically for shopping malls. Manage tenants, track payments, and generate reports with ease.
              </p>

            </div>

            {/* Dashboard Preview Card */}
            <div className="relative">
              <Card className="bg-white/20 backdrop-blur-lg border border-white/20 shadow-2xl">
                <div className="space-y-4">
                  {dashboardMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/30 backdrop-blur-sm rounded-lg border border-white/30">
                      <div className="flex items-center space-x-3">
                        {metric.icon}
                        <span className="text-white font-medium">{metric.label}</span>
                      </div>
                      <Badge color="light" size="lg" className="text-white bg-white/20">
                        {metric.value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-300">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-blue-700/50 border-blue-500/50">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2 text-white">{stat.number}</div>
                  <div className="text-blue-200">{stat.label}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <Footer container>
        <div className="w-full">
          <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
            <div>
              <FooterBrand
                href="#"
                src="/logo.png"
                alt="Auto Billing Logo"
                name="Auto Billing"
                className="text-white"
              />
              <p className="text-gray-400 mt-4 max-w-sm">
                The most trusted billing platform for shopping malls worldwide.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
              <div>
                <FooterTitle title="Product" className="text-black dark:text-white" />
                <FooterLinkGroup col>
                  <FooterLink href="#" className="text-gray-400 hover:text-white">Features</FooterLink>
                  <FooterLink href="#" className="text-gray-400 hover:text-white">Pricing</FooterLink>
                  <FooterLink href="#" className="text-gray-400 hover:text-white">Security</FooterLink>
                  <FooterLink href="#" className="text-gray-400 hover:text-white">Integrations</FooterLink>
                </FooterLinkGroup>
              </div>
              <div>
                <FooterTitle title="Company" className="text-black dark:text-white" />
                <FooterLinkGroup col>
                  <FooterLink href="#" className="text-gray-400 hover:text-white">About</FooterLink>
                  <FooterLink href="#" className="text-gray-400 hover:text-white">Careers</FooterLink>
                  <FooterLink href="#" className="text-gray-400 hover:text-white">Press</FooterLink>
                  <FooterLink href="#" className="text-gray-400 hover:text-white">Contact</FooterLink>
                </FooterLinkGroup>
              </div>
              <div>
                <FooterTitle title="Support" className="text-black dark:text-white" />
                <FooterLinkGroup col>
                  <FooterLink href="#" className="text-gray-400 hover:text-white">Help Center</FooterLink>
                  <FooterLink href="#" className="text-gray-400 hover:text-white">Documentation</FooterLink>
                  <FooterLink href="#" className="text-gray-400 hover:text-white">API Reference</FooterLink>
                  <FooterLink href="#" className="text-gray-400 hover:text-white">Community</FooterLink>
                </FooterLinkGroup>
              </div>
            </div>
          </div>
          <FooterDivider />
          <div className="w-full sm:flex sm:items-center sm:justify-between">
            <FooterCopyright href="#" by="Auto Billing™" year={2025} className="text-gray-400" />
          </div>
        </div>
      </Footer>
    </div>
  );
}