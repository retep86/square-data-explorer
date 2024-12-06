import React, { useState, useEffect } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { CircleStackIcon } from "@heroicons/react/24/outline";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(
        "A password reset link has been sent to your email address."
      );
    } catch (err) {
      setError(
        "Failed to send password reset email. Please ensure the email is correct."
      );
    }
  };

  const handleBackToLogin = () => {
    navigate("/login", { state: { email } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Section */}
        <div className="hidden md:flex bg-blue-600 text-white flex-col justify-center items-center p-8">
          <CircleStackIcon className="h-16 w-16 mb-4" />
          <h2 className="text-2xl font-bold">Square Data Explorer</h2>
          <p className="text-center mt-4">
            Explore your data with ease and efficiency.
          </p>
        </div>

        {/* Right Section */}
        <div className="p-6 md:p-12">
          <h2 className="text-2xl font-bold text-gray-700 text-center">
            Forgot Password
          </h2>
          <p className="text-center text-sm text-gray-500 mt-2">
            Enter your email address and we’ll send you a link to reset your
            password.
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 mt-4 rounded-md text-center">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 text-green-600 p-3 mt-4 rounded-md text-center">
              {successMessage}
            </div>
          )}

          <form onSubmit={handlePasswordReset} className="mt-6 space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g. jane@example.com"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Reset Password Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send Reset Link
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            <button
              onClick={handleBackToLogin}
              className="text-blue-600 hover:underline font-medium"
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
