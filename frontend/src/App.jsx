import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./assets/pages/Home.jsx";
import Profile from "./assets/pages/Profile.jsx";
import About from "./assets/pages/About.jsx";
import Liked from "./assets/pages/Liked.jsx";
import NavBar from "./assets/components/NavBar.jsx";
import Login from "./assets/pages/Login.jsx";
import Signup from "./assets/pages/Signup.jsx";
import ProtectedRoute from "./assets/components/ProtectedRoute.jsx";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const App = () => {
  const [hideNavBar, setHideNavBar] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [favoriteCars, setFavoriteCars] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);


  const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;


  // Fetch user details when logged in
  const fetchUser = async () => {
    try {
        const token = localStorage.getItem("token");
        
        if (!token || token === "null") {
            console.log("🔴 No valid token found. Skipping fetchUser.");
            return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setUser(response.data);
    } catch (error) {
        console.error("❌ Error fetching user:", error);
        if (error.response?.status === 401) {
            console.log("🚨 Unauthorized! Logging out...");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsLoggedIn(false);
            setUser(null);
        }
    }
};

  // Fetch favorite cars from API
  const fetchFavorites = async () => {
    if (!user) return;
    setLoadingFavorites(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setFavoriteCars(response.data);
      localStorage.setItem(`favorites`, JSON.stringify(response.data)); // Cache data
    } catch (error) {
      console.error("❌ Error fetching favorites:", error);
    } finally {
      setLoadingFavorites(false);
    }
  };

  // When user changes, fetch new favorites
  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  // Store user data in localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Check token expiration and log out if expired
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
  
      // ✅ If token is missing or empty, log out the user safely
      if (!token || token === "null") {
          console.log("🔴 No valid token found, logging out...");
          setIsLoggedIn(false);
          setUser(null);
          return;
      }
  
      try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
  
          if (decoded.exp < currentTime) {
              console.log("⏳ Token expired! Logging out...");
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              setIsLoggedIn(false);
              setUser(null);
          }
      } catch (error) {
          console.error("🚨 Invalid token:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsLoggedIn(false);
          setUser(null);
      }
  };
    

    checkTokenExpiration();
  }, [isLoggedIn]);

  // Fetch user data on login state change
  useEffect(() => {
    if (isLoggedIn) {
      fetchUser();
      fetchFavorites();
    }
  }, [isLoggedIn]);

  return (
    <Router>
      {!hideNavBar && (
        <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} API_BASE_URL={API_BASE_URL} />
      )}
      <Routes>
        <Route path="/" element={<Home setHideNavBar={setHideNavBar} user={user} favoriteCars={favoriteCars} API_BASE_URL={API_BASE_URL} />} />
        <Route path="/about" element={<About />} />

        {/* 🔒 Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Profile user={user} API_BASE_URL={API_BASE_URL} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/liked"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Liked
                user={user}
                favoriteCars={favoriteCars}
                loadingFavorites={loadingFavorites}
                API_BASE_URL={API_BASE_URL}
              />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} API_BASE_URL={API_BASE_URL} />} />
        <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} API_BASE_URL={API_BASE_URL} />} />
      </Routes>
    </Router>
  );
};

export default App;
