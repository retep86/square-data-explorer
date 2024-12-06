import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Sign out the user
    auth.signOut()
      .then(() => {
        // Redirect to login or home page
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700">Logging Out...</h2>
        <p className="text-gray-600 mt-4">You will be redirected shortly.</p>
      </div>
    </div>
  );
}

export default Logout;
