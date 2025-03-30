import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", formData, { withCredentials: true });
      alert(response.data.message);
      navigate("/editor"); // ✅ Redirect after successful login
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-sm w-full text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome Back!</h2>
        <p className="text-gray-500 mb-4">Sign in to continue</p>

        {/* Google Login */}
        <a
          href="http://localhost:3000/auth/google"
          className="flex items-center justify-center bg-red-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-red-600 transition-transform transform hover:scale-105"
        >
          <img
            src="https://img.icons8.com/color/48/000000/google-logo.png"
            alt="Google"
            className="w-6 h-6 mr-3"
          />
          <span className="font-semibold">Login with Google</span>
        </a>

        {/* Divider */}
        <div className="my-6 text-gray-400 relative">
          <span className="absolute left-1/2 transform -translate-x-1/2 bg-white px-2">OR</span>
          <div className="border-t border-gray-300 mt-3"></div>
        </div>

        {/* Email & Password Login Form */}
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded-lg"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        {/* Signup Redirect */}
        <div className="mt-4 border-t border-gray-300 pt-4">
          <p className="text-gray-500">
            Don't have an account?{" "}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
