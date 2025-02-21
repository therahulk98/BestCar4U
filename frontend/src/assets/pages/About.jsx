import React from "react";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-red-500 text-white  pt-24 ">
      {/* Container */}
      <div className="max-w-5xl bg-gray-900 p-10 rounded-3xl shadow-2xl text-center">
        {/* Title */}
        <h1 className="text-5xl font-extrabold mb-6 text-blue-400">
          About <span className="text-purple-400">BestCar4U</span>
        </h1>
        
        {/* Description */}
        <p className="text-lg text-gray-300 mb-6 leading-relaxed">
          At <span className="text-white font-semibold">BestCar4U</span>, we help car buyers find their perfect vehicle 
          with ease. Whether you're looking for a budget-friendly car or a luxury ride, 
          we provide comprehensive information and an intuitive search experience.
        </p>

        {/* Why Choose Us Section */}
        <h2 className="text-3xl font-bold text-blue-300 mb-4">Why Choose Us?</h2>
        <ul className="text-lg text-gray-300 space-y-3 mb-8">
          <li className="flex items-center gap-3">
            ✅ <span>Extensive database of top car brands</span>
          </li>
          <li className="flex items-center gap-3">
            ✅ <span>Smart filtering system for quick searches</span>
          </li>
          <li className="flex items-center gap-3">
            ✅ <span>Detailed specifications</span>
          </li>
          <li className="flex items-center gap-3">
            ✅ <span>User-friendly interface with a seamless experience</span>
          </li>
        </ul>
      </div>

      {/* Footer */}
        <Footer/>
    </div>
  );
};

export default About;
