import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white py-5 mt-auto ">
      <div className="flex items-center">
        <div>
          <img src="/carlogo.jpg" alt="carLogo" width={250} />
        </div>
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center px-4">
          {/* Developer Info */}
          <p className="text-md">
            Developed by <span className="font-semibold">Rahul Kumar</span>
          </p>

          {/* GitHub Link */}
          <a
            href="https://github.com/therahulk98"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-400 transition text-lg mt-2"
          >
            GitHub: @Rahul21mce214
          </a>

          {/* Data Disclaimer */}
         <p className="mt-4 text-sm text-gray-400">*The data is till 2020 only</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
