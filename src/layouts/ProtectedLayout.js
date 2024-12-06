import React from "react";
import Sidebar from "../components/Sidebar";

function ProtectedLayout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}

export default ProtectedLayout;
