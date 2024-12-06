import React, { useState } from "react";
import {
  CreditCardIcon,
  ChartBarSquareIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BriefcaseIcon,
  CircleStackIcon,
  Cog6ToothIcon,
  HomeIcon,
  ArrowUpOnSquareStackIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const [expandedSection, setExpandedSection] = useState(null); // Store only one expanded section
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSection = (section) => {
    setExpandedSection((prevSection) =>
      prevSection === section ? null : section
    ); // Collapse if already open, else expand
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  // Function to determine if a route is active
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="bg-blue-600 text-white w-64 p-4 flex flex-col h-screen">
      {/* App Header */}
      <div className="flex items-center space-x-2 mb-4">
        <CircleStackIcon className="h-8 w-8" />
        <h1 className="text-1xl font-bold">Square Data Explorer</h1>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <button
              onClick={() => navigate("/dashboard")}
              className={`flex items-center py-2 px-4 rounded w-full text-left font-bold ${
                isActive("/dashboard") ? "bg-blue-500" : "hover:bg-blue-500"
              }`}
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Dashboard
            </button>
          </li>

          {/* Payments */}
          <li>
            <div
              className="flex items-center justify-between py-2 px-4 cursor-pointer hover:bg-blue-500 rounded font-bold"
              onClick={() => toggleSection("payments")}
            >
              <div className="flex items-center">
                <CreditCardIcon className="h-5 w-5 mr-2" />
                <span>Payments</span>
              </div>
              {expandedSection === "payments" ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </div>
            {expandedSection === "payments" && (
              <ul className="space-y-1">
                {["Payments", "Refunds", "Disputes", "Invoices"].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => navigate(`/payments/${item.toLowerCase()}`)}
                      className="block py-2 pl-11 rounded hover:bg-blue-500 text-left w-full"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Commerce */}
          <li>
            <div
              className="flex items-center justify-between py-2 px-4 cursor-pointer hover:bg-blue-500 rounded font-bold"
              onClick={() => toggleSection("commerce")}
            >
              <div className="flex items-center">
                <ChartBarSquareIcon className="h-5 w-5 mr-2" />
                <span>Commerce</span>
              </div>
              {expandedSection === "commerce" ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </div>
            {expandedSection === "commerce" && (
              <ul className=" space-y-1">
                {["Orders", "Custom Attribute Definitions"].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() =>
                        navigate(`/commerce/${item.toLowerCase().replace(/ /g, "-")}`)
                      }
                      className="block py-2 pl-11 rounded hover:bg-blue-500 text-left w-full"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Customers */}
          <li>
            <div
              className="flex items-center justify-between py-2 px-4 cursor-pointer hover:bg-blue-500 rounded font-bold"
              onClick={() => toggleSection("customers")}
            >
              <div className="flex items-center">
                <UserCircleIcon className="h-5 w-5 mr-2" />
                <span>Customers</span>
              </div>
              {expandedSection === "customers" ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </div>
            {expandedSection === "customers" && (
              <ul className="space-y-1">
                {["Customers", "Customer Groups"].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() =>
                        navigate(`/customers/${item.toLowerCase().replace(/ /g, "-")}`)
                      }
                      className="block py-2 pl-11 rounded hover:bg-blue-500 text-left w-full"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-blue-500 pt-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => navigate("/settings")}
              className={`flex items-center py-2 px-4 rounded w-full text-left ${
                isActive("/settings") ? "bg-blue-500" : "hover:bg-blue-500"
              }`}
            >
              <Cog6ToothIcon className="h-5 w-5 mr-2" />
              Settings
            </button>
          </li>
          <li>
          <button
  onClick={() => navigate("/logout")}
  className="flex items-center py-2 px-4 rounded hover:bg-blue-500 w-full text-left"
>
  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
  Log Out
</button>

          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
