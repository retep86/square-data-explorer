import React from "react";

function PublicLayout({ children }) {
  return <div className="min-h-screen bg-gray-100 flex items-center justify-center">{children}</div>;
}

export default PublicLayout;
