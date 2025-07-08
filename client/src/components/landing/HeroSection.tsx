import {FC, JSX} from "react";
const HeroSection:FC<{children:JSX.Element;}> = ({children}) => {
  return (
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
            {children}
          </div>
        </div>
      </section>
  );
}
export default HeroSection;