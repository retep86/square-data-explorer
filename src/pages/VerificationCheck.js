import React from "react";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Verify Your Email</h2>
        <p className="text-gray-600 mt-4">
          A verification link has been sent to your email address. Please check
          your inbox and click the link to verify your email.
        </p>
        <p className="text-gray-600 mt-4">
          Once verified, click the button below to proceed to your dashboard.
        </p>
        <div className="mt-6">
          <button
            onClick={handleGoToLogin}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
