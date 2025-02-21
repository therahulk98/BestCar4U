import React from "react";
import Footer from "../components/Footer";

const Profile = ({ user }) => {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-r from-purple-500 to-red-500">
      
      {/* Profile Heading */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-4xl font-bold text-white mb-4">Profile</h1>

        {/* Display User Info */}
        <div className="bg-white p-6 rounded-xl shadow-lg text-center w-80">
          <img
            src="https://ui-avatars.com/api/?name=John+Doe&background=random"
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-semibold">{user?.name || "Guest"}</h2>
          <p className="text-gray-600">{user?.email || "No email available"}</p>
        </div>
      </div>

      
      <Footer />
    </div>
  );
};

export default Profile;
