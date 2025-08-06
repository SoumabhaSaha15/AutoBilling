
import { Card, Badge, } from 'flowbite-react';
import {  HiDocumentText, HiUsers, HiTrendingUp, } from 'react-icons/hi';
const DashboardPreviewSection: React.FC = () => {
  const dashboardMetrics = [
    { icon: <HiDocumentText className="h-5 w-5 text-white" />, label: "Monthly Revenue", value: "$2.4M" },
    { icon: <HiUsers className="h-5 w-5 text-white" />, label: "Active Tenants", value: "150" },
    { icon: <HiTrendingUp className="h-5 w-5 text-white" />, label: "Collection Rate", value: "98.5%" }
  ];

  return (
    <div className="relative" data-aos="zoom-in-up" data-aos-delay='100'>
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
  );
}
export default DashboardPreviewSection;
