import React, { createContext, useContext, useState, useEffect } from "react";

const TimeoutContext = createContext();

export const TimeoutProvider = ({ children }) => {
    const [isTimeoutModalVisible, setIsTimeoutModalVisible] = useState(false);
    const [countdown, setCountdown] = useState(60); // 60-second countdown
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
   //     }, 10 * 1000); // 10 seconds
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
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <h2 className="text-xl font-bold mb-4">Are you still there?</h2>
                        <p className="text-gray-700 mb-4">
                            Your session will expire in <span>{countdown}</span> seconds.
                        </p>
                        <button
                            onClick={extendSession}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Stay Logged In
                        </button>
                    </div>
                </div>
            )}
        </TimeoutContext.Provider>
    );
};

export const useTimeout = () => useContext(TimeoutContext);
