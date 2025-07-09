import { Card } from 'flowbite-react';

const StatSection: React.FC = () => {
  const stats = [
    { number: "500+", label: "Shopping Malls" },
    { number: "50K+", label: "Tenants Managed" },
    { number: "99.9%", label: "Uptime" },
    { number: "$2B+", label: "Processed Revenue" }
  ];
  return (
    <section className="bg-blue-600 text-white py-16 snap-start" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-blue-700/50 border-blue-500/50 hover:shadow-2xl hover:transition-shadow">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 text-white">{stat.number}</div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
export default StatSection;
