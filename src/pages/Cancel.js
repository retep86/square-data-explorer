import React from "react";

function Cancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <h1 className="text-3xl font-bold text-red-800">Subscription Cancelled</h1>
      <p className="mt-4 text-center">
        You can try subscribing again by signing up or logging into your account.
      </p>
    </div>
  );
}

export default Cancel;
