import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../config/firebase"; // Firebase configuration
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { CircleStackIcon } from "@heroicons/react/24/outline";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle email/password signup
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };
  

  // Handle Google signup/login
  const handleGoogleSignUp = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, provider); // result is defined here
      const user = result.user;
  
      if (user) {
        navigate("/dashboard"); // Redirect to dashboard if user exists
      }
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists. Logging in...");
        try {
          // Attempt to log in the user
          // const loginResult = await signInWithPopup(auth, provider);
          navigate("/dashboard");
        } catch (loginError) {
          setError("Failed to log in. Please try again.");
        }
      } else {
        setError("Failed to sign up with Google. Please try again.");
      }
    }
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
            Create Your Account
          </h2>
          <p className="text-center text-sm text-gray-500 mt-2">
            Start your journey with us today.
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 mt-4 rounded-md text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="mt-6 space-y-4">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Jane Doe"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
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

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create an Account
            </button>
          </form>

          {/* Google Signup */}
          <div className="mt-6 text-center">
            <button
              onClick={handleGoogleSignUp}
              className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="h-5 w-5 mr-2"
              />
              Sign up with Google
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Log in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
