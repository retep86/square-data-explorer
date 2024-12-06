import React, { useState } from "react";
import {
  CheckCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CogIcon,
  UserIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";

function ContentArea() {
  const [isCardOpen, setIsCardOpen] = useState(true); // Card is expanded by default
  const [steps, setSteps] = useState([
    {
      id: 1,
      name: "Connection Setup",
      description: "Set up the necessary connections to integrate your systems.",
      icon: <CogIcon className="h-6 w-6 text-blue-600" />,
      completed: false,
    },
    {
      id: 2,
      name: "Add Users",
      description: "Add your team members to get them started with the system.",
      icon: <UserIcon className="h-6 w-6 text-blue-600" />,
      completed: false,
    },
    {
      id: 3,
      name: "Upgrade to Pro",
      description: "Unlock additional features by upgrading to Pro.",
      icon: <ArrowUpCircleIcon className="h-6 w-6 text-blue-600" />,
      completed: false,
    },
  ]);

  const remainingSteps = steps.filter((step) => !step.completed).length;

  const completeStep = (id) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === id ? { ...step, completed: true } : step
      )
    );
  };

  return (
    <main className="flex-1 bg-gray-100 p-6 h-screen">
      <h2 className="text-3xl font-bold mb-4">Welcome to Square Data Explorer!</h2>
      <p className="text-gray-700 mb-6">
        Complete the steps below to get started with your setup.
      </p>

      {/* Collapsible Card */}
      <div className="bg-white shadow-md rounded-md p-4">
        {/* Card Header */}
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsCardOpen((prev) => !prev)}
        >
          <h3 className="text-xl font-bold">Getting Started</h3>
          <div className="flex items-center space-x-2">
            <div
              className={`text-sm ${
                remainingSteps === 0 ? "text-green-500" : "text-gray-600"
              }`}
            >
              {remainingSteps === 0
                ? "All steps completed"
                : `${remainingSteps} step${remainingSteps > 1 ? "s" : ""} remaining`}
            </div>
            {isCardOpen ? (
              <ChevronUpIcon className="h-6 w-6 text-gray-600" />
            ) : (
              <ChevronDownIcon className="h-6 w-6 text-gray-600" />
            )}
          </div>
        </div>

        {/* Card Content */}
        {isCardOpen && (
          <div className="mt-4">
            <ul className="space-y-4">
              {steps.map((step) => (
                <li
                  key={step.id}
                  className={`flex items-center justify-between border-b pb-4 last:border-b-0 ${
                    step.completed ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Icon */}
                    {step.icon}
                    {/* Step Details */}
                    <div>
                      <h4 className="font-bold text-lg">{step.name}</h4>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  {/* Completion Status */}
                  {step.completed ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  ) : (
                    <button
                      onClick={() => completeStep(step.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Complete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}

export default ContentArea;
