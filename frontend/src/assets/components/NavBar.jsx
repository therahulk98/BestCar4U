import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const NavBar = ({ isLoggedIn, setIsLoggedIn, user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsLoggedIn(false);
          navigate("/login"); // ✅ Navigates properly
        }
      }
    };

    checkTokenExpiration();
  }, [isLoggedIn, navigate]); // ✅ Triggers when login state changes

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem(`favorites`);
    setIsLoggedIn(false); // ✅ Instant UI Update
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 z-20 w-full h-16 bg-gray-800 text-white text-lg font-semibold flex items-center justify-between px-8 shadow-md">
      
      
      {/* Left Section: Logo */}
      <Link to="/">
        <img src="/carlogo.jpg" alt="BestCar4U Logo" width={130} className="rounded-md" />
      </Link>

      {/* Center Section: Navigation Links */}
      <ul className="flex gap-8 font-semibold text-2xl text-purple-300">
        <li><Link to="/" className="hover:text-gray-400">Home</Link></li>
        <li><Link to="/liked" className="hover:text-gray-400">Liked 💜</Link></li>
        <li><Link to="/profile" className="hover:text-gray-400">Profile</Link></li>
        <li><Link to="/about" className="hover:text-gray-400">About Us</Link></li>
      </ul>

      {/* Right Section: Login/Logout Button */}
      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          <span className="text-white font-semibold">👤Hi, {user?.name}</span>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
            onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
          onClick={() => navigate("/login")}>
          Login
        </button>
      )}
    </nav>
  );
};

export default NavBar;
