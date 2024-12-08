import React, { useState, useEffect } from "react";
import {
  CreditCardIcon,
  ChartBarSquareIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CircleStackIcon,
  Cog6ToothIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const [expandedSection, setExpandedSection] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialExpandedSection = (path) => {
    if (path.startsWith('/payments')) return 'payments';
    if (path.startsWith('/commerce')) return 'commerce';
    if (path.startsWith('/customers')) return 'customers';
    return null;
  };

  useEffect(() => {
    const section = getInitialExpandedSection(location.pathname);
    setExpandedSection(section);
  }, [location.pathname]);

  const toggleSection = (section) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setExpandedSection(section);
    } else {
      setExpandedSection((prevSection) =>
        prevSection === section ? null : section
      );
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setExpandedSection(null);
    } else {
      const section = getInitialExpandedSection(location.pathname);
      setExpandedSection(section);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const navItem = (icon, text, onClick, isActiveRoute = false, showChevron = false, isExpanded = false) => (
    <div
      onClick={onClick}
      className={`flex items-center cursor-pointer w-full transition-all duration-200
        ${isCollapsed ? 'justify-center' : 'p-2.5 justify-between rounded-lg hover:bg-blue-700/50 dark:hover:bg-gray-700/50'}
        ${!isCollapsed && isActiveRoute ? "bg-blue-700/50 dark:bg-gray-700/50" : ""}`}
    >
      <div className={`flex items-center min-w-0 ${isCollapsed ? 'p-2.5 rounded-lg hover:bg-blue-700/50 dark:hover:bg-gray-700/50' : ''} 
        ${isCollapsed && isActiveRoute ? 'bg-blue-700/50 dark:bg-gray-700/50' : ''}`}>
        {React.cloneElement(icon, { 
          className: `h-5 w-5 shrink-0 ${isActiveRoute ? 'text-white' : 'text-blue-100 dark:text-gray-300'}`
        })}
        {!isCollapsed && (
          <span className={`ml-3 truncate ${isActiveRoute ? 'text-white font-medium' : 'text-blue-100 dark:text-gray-300'}`}>
            {text}
          </span>
        )}
      </div>
      {!isCollapsed && showChevron && (
        <div className="ml-2 shrink-0 text-blue-100 dark:text-gray-300">
          {isExpanded ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </div>
      )}
    </div>
  );

  return (
    <aside 
      className={`bg-blue-600 dark:bg-gray-800 h-screen sticky top-0 transition-all duration-300 flex flex-col
        border-r border-blue-500/20 dark:border-gray-700
        ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Header */}
      <div className={`flex items-center h-16 px-4 border-b border-blue-500/20 dark:border-gray-700
        ${isCollapsed ? 'justify-center' : 'justify-between'}`}
      >
        {!isCollapsed && (
          <div className="flex items-center flex-1 min-w-0">
            <CircleStackIcon className="h-6 w-6 text-blue-100 dark:text-gray-300" />
            <h1 className="text-lg font-bold ml-3 truncate text-white">
              Square Data Explorer
            </h1>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-blue-700/50 dark:hover:bg-gray-700/50 transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronDoubleRightIcon className="h-5 w-5 text-blue-100 dark:text-gray-300" />
          ) : (
            <ChevronDoubleLeftIcon className="h-5 w-5 text-blue-100 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className={`space-y-1.5 px-3`}>
          <li>
            {navItem(
              <HomeIcon />,
              "Dashboard",
              () => navigate("/dashboard"),
              isActive("/dashboard")
            )}
          </li>

          <li>
            {navItem(
              <CreditCardIcon />,
              "Payments",
              () => toggleSection("payments"),
              isActive("/payments"),
              true,
              expandedSection === "payments"
            )}
            {!isCollapsed && expandedSection === "payments" && (
              <ul className="mt-1 space-y-1">
                {["Payments", "Refunds", "Disputes", "Invoices"].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => navigate(`/payments/${item.toLowerCase()}`)}
                      className={`w-full py-2.5 pl-11 pr-4 text-left rounded-lg transition-colors duration-200
                        ${isActive(`/payments/${item.toLowerCase()}`)
                          ? "bg-blue-700/50 dark:bg-gray-700/50 text-white font-medium"
                          : "text-blue-100 dark:text-gray-300 hover:bg-blue-700/30 dark:hover:bg-gray-700/30"
                        }`}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            {navItem(
              <ChartBarSquareIcon />,
              "Commerce",
              () => toggleSection("commerce"),
              isActive("/commerce"),
              true,
              expandedSection === "commerce"
            )}
            {!isCollapsed && expandedSection === "commerce" && (
              <ul className="mt-1 space-y-1">
                {["Orders", "Custom Attribute Definitions"].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => navigate(`/commerce/${item.toLowerCase().replace(/ /g, "-")}`)}
                      className={`w-full py-2.5 pl-11 pr-4 text-left rounded-lg transition-colors duration-200
                        ${isActive(`/commerce/${item.toLowerCase().replace(/ /g, "-")}`)
                          ? "bg-blue-700/50 dark:bg-gray-700/50 text-white font-medium"
                          : "text-blue-100 dark:text-gray-300 hover:bg-blue-700/30 dark:hover:bg-gray-700/30"
                        }`}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            {navItem(
              <UserCircleIcon />,
              "Customers",
              () => toggleSection("customers"),
              isActive("/customers"),
              true,
              expandedSection === "customers"
            )}
            {!isCollapsed && expandedSection === "customers" && (
              <ul className="mt-1 space-y-1">
                {["Customers", "Customer Groups"].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => navigate(`/customers/${item.toLowerCase().replace(/ /g, "-")}`)}
                      className={`w-full py-2.5 pl-11 pr-4 text-left rounded-lg transition-colors duration-200
                        ${isActive(`/customers/${item.toLowerCase().replace(/ /g, "-")}`)
                          ? "bg-blue-700/50 dark:bg-gray-700/50 text-white font-medium"
                          : "text-blue-100 dark:text-gray-300 hover:bg-blue-700/30 dark:hover:bg-gray-700/30"
                        }`}
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

      {/* Footer */}
      <div className="mt-auto border-t border-blue-500/20 dark:border-gray-700">
        <ul className={`space-y-1.5 p-3`}>
          <li>
            {navItem(
              <Cog6ToothIcon />,
              "Settings",
              () => navigate("/settings"),
              isActive("/settings")
            )}
          </li>
          <li>
            {navItem(
              <ArrowRightOnRectangleIcon />,
              "Log Out",
              handleLogout
            )}
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;