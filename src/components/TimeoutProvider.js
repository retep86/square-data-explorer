import React, { createContext, useContext, useState, useEffect } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";

const TimeoutContext = createContext();

export const TimeoutProvider = ({ children }) => {
    const [isTimeoutModalVisible, setIsTimeoutModalVisible] = useState(false);
    const [countdown, setCountdown] = useState(60);
    let timeoutTimer, countdownTimer;

    const resetInactivityTimer = () => {
        setIsTimeoutModalVisible(false);
        setCountdown(60); // Reset countdown
        clearTimeout(timeoutTimer);
        clearInterval(countdownTimer);

        // Set inactivity timeout
        timeoutTimer = setTimeout(() => {
            setIsTimeoutModalVisible(true);
            startCountdown(); // Start the countdown when the modal shows
        }, 10 * 60 * 1000); // 10 minutes
    //   }, 10 * 1000); // 10 seconds
    };

    const startCountdown = () => {
        countdownTimer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownTimer);
                    logoutUser();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const logoutUser = () => {
        // Redirect to logout page
        window.location.href = "/logout";
    };

    const extendSession = () => {
        resetInactivityTimer();
    };

    useEffect(() => {
        const setupEventListeners = () => {
            window.addEventListener("mousemove", resetInactivityTimer);
            window.addEventListener("keydown", resetInactivityTimer);
        };

        setupEventListeners();
        resetInactivityTimer(); // Start the timer initially

        return () => {
            window.removeEventListener("mousemove", resetInactivityTimer);
            window.removeEventListener("keydown", resetInactivityTimer);
            clearTimeout(timeoutTimer);
            clearInterval(countdownTimer);
        };
    }, []);

    return (
        <TimeoutContext.Provider value={{ extendSession }}>
            {children}
            {isTimeoutModalVisible && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="min-h-screen px-4 text-center">
                        {/* Background overlay with blur */}
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"></div>

                        {/* Modal positioning */}
                        <div className="fixed inset-0 flex items-center justify-center">
                            {/* Modal content */}
                            <div className="relative bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl shadow-2xl p-8 transform transition-all">
                                {/* Timer Icon */}
                                <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
                                    <ClockIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                    Session Timeout
                                </h2>

                                {/* Description */}
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    For your security, your session will expire in:
                                </p>

                                {/* Countdown Timer */}
                                <div className="mb-8">
                                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                        {countdown}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        seconds
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={extendSession}
                                        className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                                    >
                                        Stay Logged In
                                    </button>
                                    <button
                                        onClick={logoutUser}
                                        className="w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                                    >
                                        Logout Now
                                    </button>
                                </div>

                                {/* Security Note */}
                                <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
                                    This timeout helps protect your information from unauthorized access.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </TimeoutContext.Provider>
    );
};

export const useTimeout = () => useContext(TimeoutContext);