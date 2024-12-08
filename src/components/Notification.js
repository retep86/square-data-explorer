import React from "react";

const Notification = ({ visible, message, icon: Icon }) =>
  visible ? (
    <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-md shadow-lg flex items-center space-x-2">
      <Icon className="h-5 w-5 text-green-600" />
      <span>{message}</span>
    </div>
  ) : null;

export default Notification;
