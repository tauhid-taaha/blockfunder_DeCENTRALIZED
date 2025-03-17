import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    answer: "",
    defaultWalletAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Format the data before sending
      const registrationData = {
        ...formData,
        address: {
          street: formData.address,
          city: "",
          state: "",
          country: "",
          zipCode: ""
        }
      };

      const res = await axios.post("http://localhost:8080/api/v1/auth/register", registrationData);
      if (res.data.success) {
        alert("Registration Successful!");
        navigate("/login");
      } else {
        setError(res.data.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setError(error.response?.data?.message || "Registration Error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-white text-center mb-4">Register</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Street Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="answer"
            placeholder="Security Answer"
            value={formData.answer}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="defaultWalletAddress"
            placeholder="Wallet Address (Optional)"
            value={formData.defaultWalletAddress}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded mt-4 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Register'
            )}
          </button>
        </form>
        
        <p className="mt-4 text-center text-gray-400">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-500 hover:text-blue-400"
          >
            Login here
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
