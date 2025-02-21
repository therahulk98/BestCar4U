import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = ({ setIsLoggedIn, API_BASE_URL }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); 
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
        setError("All fields are required!");
        return;
    }

    if (password !== confirmPassword) {
        setError("Passwords do not match!");
        return;
    }

    setLoading(true);

    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/auth/signup`,
            { name, email, password },
            { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.token) {
            console.log("✅ Signup successful. Storing token...");

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user)); 
            
            setIsLoggedIn(true);
            navigate("/");
        } else {
            throw new Error("No token received!");
        }
    } catch (err) {
        console.error("❌ Signup Error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Signup failed!");
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-red-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
        
        <h1 className="text-3xl font-bold text-gray-800">Create an Account</h1>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <form onSubmit={handleSignup} className="mt-5">
          <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg mb-3"
            value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg mb-3"
            value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg mb-3"
            value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type="password" placeholder="Confirm Password" className="w-full p-3 border rounded-lg mb-3"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

          <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white font-semibold p-3 rounded-lg hover:bg-purple-700 transition">
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4">
          Already have an account? <a href="/login" className="text-purple-600 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup; // 
