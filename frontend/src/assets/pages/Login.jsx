import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        console.log("📤 Sending login request...");
        const response = await axios.post("http://localhost:5000/api/auth/login", {
            email,
            password,
        });

        console.log("✅ Login Successful! Response:", response.data);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user)); 
        setIsLoggedIn(true);
        navigate("/");

    } catch (err) {
        setError(err.response?.data?.message || "Invalid email or password!");
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-red-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
        
        <h1 className="text-3xl font-bold text-gray-800">Login</h1>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <form onSubmit={handleLogin} className="mt-5">
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg mb-3"
            value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg mb-3"
            value={password} onChange={(e) => setPassword(e.target.value)} />

          <button type="submit" disabled={loading} 
            className="w-full bg-purple-600 text-white font-semibold p-3 rounded-lg hover:bg-purple-700 transition">
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4">
          Don't have an account? <a href="/signup" className="text-purple-600 hover:underline"> Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
