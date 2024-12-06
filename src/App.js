import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user] = useAuthState(auth); // Firebase hook to check if the user is authenticated

  return (
    <Router>
      {user ? (
        <div className="flex min-h-screen">
          {/* Show Sidebar only if the user is authenticated */}
          <Sidebar />
          <main className="flex-1 bg-gray-100 p-6">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          {/* Only show Login page if the user is not authenticated */}
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
