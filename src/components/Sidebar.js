import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCardIcon,
  ChartBarSquareIcon,
  UserIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BriefcaseIcon,
  MapPinIcon,
  CircleStackIcon,
  CogIcon,
  HomeIcon,
  ArrowUpCircleIcon,
  QuestionMarkCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";

function Sidebar({ onSelectContent }) {
  const [expandedSection, setExpandedSection] = useState(null); // Store only one expanded section

  const toggleSection = (section) => {
    setExpandedSection((prevSection) =>
      prevSection === section ? null : section
    ); // Collapse if already open, else expand
  };

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
          <Link
              to="/"
              className="flex items-center py-2 px-4 rounded hover:bg-blue-500 w-full text-left font-bold"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Dashboard
            </Link>

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
              <ul className="ml-4 space-y-1">
                {[
                  "Payments",
                  "Refunds",
                  "Disputes",
                  "Invoices",
                  "Cards",
                  "Bank accounts",
                  "Payouts",
                  "Devices",
                ].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => onSelectContent(item)}
                      className="block py-2 px-4 rounded hover:bg-blue-500 text-left w-full"
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
              <ul className="ml-4 space-y-1">
                {["Orders", "Custom attribute definitions"].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => onSelectContent(item)}
                      className="block py-2 px-4 rounded hover:bg-blue-500 text-left w-full"
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
                <UserIcon className="h-5 w-5 mr-2" />
                <span>Customers</span>
              </div>
              {expandedSection === "customers" ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </div>
            {expandedSection === "customers" && (
              <ul className="ml-4 space-y-1">
                {[
                  "Customers",
                  "Customer groups",
                  "Customer segments",
                  "Gift cards",
                ].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => onSelectContent(item)}
                      className="block py-2 px-4 rounded hover:bg-blue-500 text-left w-full"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Staff */}
          <li>
            <div
              className="flex items-center justify-between py-2 px-4 cursor-pointer hover:bg-blue-500 rounded font-bold"
              onClick={() => toggleSection("staff")}
            >
              <div className="flex items-center">
                <BriefcaseIcon className="h-5 w-5 mr-2" />
                <span>Staff</span>
              </div>
              {expandedSection === "staff" ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </div>
            {expandedSection === "staff" && (
              <ul className="ml-4 space-y-1">
                {["Break types", "Team member wages", "Workweek config"].map(
                  (item) => (
                    <li key={item}>
                      <button
                        onClick={() => onSelectContent(item)}
                        className="block py-2 px-4 rounded hover:bg-blue-500 text-left w-full"
                      >
                        {item}
                      </button>
                    </li>
                  )
                )}
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
              onClick={() => onSelectContent("Upgrade to Pro")}
              className="flex items-center py-2 px-4 rounded hover:bg-blue-500 w-full text-left relative"
            >
              <ArrowUpCircleIcon className="h-5 w-5 mr-2" />
              Upgrade
              <span className="ml-auto text-sm bg-red-500 text-white px-2 py-0.5 rounded-full">
                On Sale!
              </span>
            </button>
          </li>
          <li>
            <button
              onClick={() => onSelectContent("Help")}
              className="flex items-center py-2 px-4 rounded hover:bg-blue-500 w-full text-left"
            >
              <QuestionMarkCircleIcon className="h-5 w-5 mr-2" />
              Help
            </button>
          </li>
          <li>
            <Link
              to="/settings"
              className="flex items-center py-2 px-4 rounded hover:bg-blue-500 w-full text-left"
            >
              <CogIcon className="h-5 w-5 mr-2" />
              Settings
            </Link>
          </li>
          <li>
            <button
              onClick={() => onSelectContent("Log Out")}
              className="flex items-center py-2 px-4 rounded hover:bg-blue-500 w-full text-left"
            >
              <ArrowRightCircleIcon className="h-5 w-5 mr-2" />
              Log Out
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
