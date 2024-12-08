import React from "react";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

function ProtectedLayout({ children }) {
  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export default ProtectedLayout;