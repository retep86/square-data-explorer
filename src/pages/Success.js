import React from "react";

function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <h1 className="text-3xl font-bold text-green-800">Subscription Successful!</h1>
      <p className="mt-4 text-center">
        Thank you for subscribing! You can now access your dashboard.
      </p>
    </div>
  );
}

export default Success;
