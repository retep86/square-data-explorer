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
      className={`flex items-center cursor-pointer w-full
        ${isCollapsed ? 'justify-center' : 'p-2 justify-between rounded hover:bg-blue-500'}
        ${!isCollapsed && isActiveRoute ? "bg-blue-500" : ""}`}
    >
      <div className={`flex items-center min-w-0 ${isCollapsed ? 'p-2 rounded hover:bg-blue-500' : ''} 
        ${isCollapsed && isActiveRoute ? 'bg-blue-500' : ''}`}>
        {React.cloneElement(icon, { 
          className: `h-5 w-5 shrink-0 ${isActiveRoute ? 'text-white' : ''}`
        })}
        {!isCollapsed && <span className="ml-2 truncate">{text}</span>}
      </div>
      {!isCollapsed && showChevron && (
        <div className="ml-2 shrink-0">
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
      className={`bg-blue-600 text-white h-screen sticky top-0 transition-all duration-300 flex flex-col
        ${isCollapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Header */}
      <div className={`flex items-center p-4 h-16 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="flex items-center flex-1 min-w-0">
            <CircleStackIcon className="h-5 w-5 shrink-0" />
            <h1 className="text-lg font-bold ml-2 truncate">Square Data Explorer</h1>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-blue-500 rounded shrink-0"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronDoubleRightIcon className="h-5 w-5" />
          ) : (
            <ChevronDoubleLeftIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="border-b border-blue-500" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className={`space-y-1 ${isCollapsed ? 'px-0' : 'px-3'}`}>
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
                      className={`w-full py-2 pl-11 pr-4 text-left rounded
                        ${isActive(`/payments/${item.toLowerCase()}`)
                          ? "bg-blue-500"
                          : "hover:bg-blue-500"
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
                      className={`w-full py-2 pl-11 pr-4 text-left rounded
                        ${isActive(`/commerce/${item.toLowerCase().replace(/ /g, "-")}`)
                          ? "bg-blue-500"
                          : "hover:bg-blue-500"
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
                      className={`w-full py-2 pl-11 pr-4 text-left rounded
                        ${isActive(`/customers/${item.toLowerCase().replace(/ /g, "-")}`)
                          ? "bg-blue-500"
                          : "hover:bg-blue-500"
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
      <div className="mt-auto border-t border-blue-500">
        <ul className={`space-y-1 ${isCollapsed ? 'p-0 py-3' : 'p-3'}`}>
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