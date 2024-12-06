import React from "react";
import { useNavigate } from "react-router-dom";
import { CircleStackIcon } from "@heroicons/react/24/outline";

function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/dashboard"); // Adjust this to your default route for logged-in users
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
        <div className="p-6 md:p-12 text-center">
          <h1 className="text-4xl font-bold text-gray-700">404</h1>
          <p className="mt-4 text-lg text-gray-500">
            Oops! The page you’re looking for doesn’t exist.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            It might have been removed or the URL may be incorrect.
          </p>
          <button
            onClick={handleGoHome}
            className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to Dashboard
          </button>
          <p className="mt-6 text-sm text-gray-600">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
