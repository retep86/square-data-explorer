import React, { useState } from "react";
import {
  CreditCardIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

function Dashboard() {
  const [sections, setSections] = useState([
    { id: 1, isOpen: true },
    { id: 2, isOpen: true },
    { id: 3, isOpen: true },
  ]);

  const toggleSection = (id) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, isOpen: !section.isOpen } : section
    ));
  };

  const stats = [
    {
      id: 1,
      name: 'Total Revenue',
      value: '$24,560.00',
      change: '+12.5%',
      isIncrease: true,
      icon: CurrencyDollarIcon,
    },
    {
      id: 2,
      name: 'Total Orders',
      value: '456',
      change: '+8.2%',
      isIncrease: true,
      icon: ShoppingCartIcon,
    },
    {
      id: 3,
      name: 'Active Customers',
      value: '2,345',
      change: '+23.1%',
      isIncrease: true,
      icon: UserGroupIcon,
    },
    {
      id: 4,
      name: 'Refund Rate',
      value: '1.5%',
      change: '-0.4%',
      isIncrease: false,
      icon: CreditCardIcon,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'Payment',
      description: 'Payment received from John Doe',
      amount: '$156.00',
      time: '5 minutes ago',
    },
    {
      id: 2,
      type: 'Order',
      description: 'New order placed #ORD-2024-002',
      amount: '$892.00',
      time: '15 minutes ago',
    },
    {
      id: 3,
      type: 'Refund',
      description: 'Refund processed for order #ORD-2024-001',
      amount: '-$45.00',
      time: '1 hour ago',
    },
  ];

  return (
    <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 min-h-screen overflow-y-auto">
      <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Dashboard</h2>
      <div className="flex items-center mb-6 text-sm text-gray-600 dark:text-gray-400">
        <ClockIcon className="h-4 w-4 mr-1" />
        Last updated: {new Date().toLocaleString()}
      </div>

      <div className="space-y-6">
        {/* Business Overview Section */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection(1)}
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Business Overview
              </h3>
            </div>
            {sections[0].isOpen ? (
              <ChevronUpIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            )}
          </div>
          
          {sections[0].isOpen && (
            <div className="mt-4 border-t dark:border-gray-700 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <stat.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className={`flex items-center space-x-1 text-sm ${
                        stat.isIncrease ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stat.isIncrease ? (
                          <ArrowUpIcon className="h-4 w-4" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4" />
                        )}
                        <span>{stat.change}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {stat.name}
                      </p>
                      <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection(2)}
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <ClockIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
            </div>
            {sections[1].isOpen ? (
              <ChevronUpIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            )}
          </div>
          
          {sections[1].isOpen && (
            <div className="mt-4 border-t dark:border-gray-700 pt-4">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between py-3 border-b dark:border-gray-700 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                    <span className={`text-sm font-medium ${
                      activity.amount.startsWith('-')
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {activity.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Dashboard;