import React from "react";
import Sidebar from "../components/Sidebar";

function ProtectedLayout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

export default ProtectedLayout;
