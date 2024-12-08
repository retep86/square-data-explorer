import React, { useState, useEffect } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  UserIcon,
  CreditCardIcon,
  ArrowTopRightOnSquareIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowsPointingInIcon,
  SunIcon,
  MoonIcon,  // Add these two
  ComputerDesktopIcon, // Add this for system theme option
} from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";
import { auth, db } from "../config/firebase";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function Settings() {
  const { theme, setTheme } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState(null);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isConnectedToSquare, setIsConnectedToSquare] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState(null);
  const [sections, setSections] = useState([]);

  const togglePasswordVisibility = (field) => {
    setIsPasswordVisible((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordChangeError(null);
    setPasswordChangeSuccess(false);
    setIsPasswordVisible({ current: false, new: false, confirm: false }); // Reset eye icon states
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordChangeError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordChangeError("New password and confirm password do not match.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      await updatePassword(auth.currentUser, newPassword);
      setPasswordChangeError(null);
      setPasswordChangeSuccess(true);

      // Clear the input fields and reset visibility states after successful update
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsPasswordVisible({ current: false, new: false, confirm: false });
    } catch (error) {
      console.error("Error changing password:", error.message);
      setPasswordChangeError(error.message);
      setPasswordChangeSuccess(false);
    }
  };

  const handleManageBilling = () => {
    const email = auth.currentUser?.email;
    if (email) {
      const billingPortalURL = `https://billing.stripe.com/p/login/14k8xDb57emH63edQQ?prefilled_email=${encodeURIComponent(
        email
      )}`;
      window.open(billingPortalURL, "_blank");
    } else {
      console.error("User not authenticated or email missing.");
    }
  };

  const handleSquareConnection = async () => {
    console.log("Initiating connection to Square...");
    setIsConnectedToSquare(true);
    setConnectionDetails({
      connectedAt: new Date().toLocaleString(),
      accountName: "Square Demo Account",
    });
  };

  const toggleSection = (id) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id ? { ...section, isOpen: !section.isOpen } : section
      )
    );
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userRef = doc(db, "users", auth.currentUser.uid);
          const userDoc = await getDoc(userRef);

          const accountInfo = userDoc.exists()
            ? {
                name: userDoc.data().name || "N/A",
                email: userDoc.data().email || "N/A",
              }
            : { name: "N/A", email: "N/A" };

          const securityInfo = {
            accountCreatedOn:
              auth.currentUser?.metadata.creationTime
                ? new Date(auth.currentUser.metadata.creationTime).toLocaleString()
                : "N/A",
            lastLogin:
              auth.currentUser?.metadata.lastSignInTime
                ? new Date(auth.currentUser.metadata.lastSignInTime).toLocaleString()
                : "N/A",
          };

          setSections([
            {
              id: 1,
              name: "Account & Security",
              icon: <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
              isOpen: false,
              content: (
                <div className="space-y-6">
                  <div className="grid gap-6">
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4 space-y-4">
                      <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Full Name
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {accountInfo.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Email Address
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {accountInfo.email}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Account Created On
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {securityInfo.accountCreatedOn}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Last Login
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {securityInfo.lastLogin}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setModalOpen(true)}
                      className="flex items-center justify-center w-full px-4 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              ),
            },
            {
              id: 2,
              name: "Square Integration",
              icon: <ArrowsPointingInIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
              isOpen: false,
              content: (
                <div className="space-y-6">
                  {isConnectedToSquare ? (
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4 space-y-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                          Connected to Square
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Account Name
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {connectionDetails?.accountName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Connected At
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {connectionDetails?.connectedAt}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Connect your account to Square to enable additional functionalities.
                        </p>
                      </div>
                      <button
                        onClick={handleSquareConnection}
                        className="flex items-center justify-center w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                      >
                        <span>Connect to Square</span>
                      </button>
                    </div>
                  )}
                </div>
              ),
            },
            {
              id: 3,
              name: "Billing Information",
              icon: <CreditCardIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
              isOpen: false,
              content: (
                <div className="space-y-6">
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4 space-y-4">
                    {/* Subscription Status */}
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Active Subscription
                      </span>
                    </div>
            
                    {/* Billing Details */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Subscription Plan
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Premium Plan
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Billing Frequency
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Monthly</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">(Renews automatically)</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Payment Amount
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          $29.99 / month
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Next Billing Date
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            December 15, 2024
                          </span>
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full">
                            In 7 days
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
            
                  {/* Payment Method */}
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white dark:bg-gray-700 rounded-md">
                          <CreditCardIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            •••• •••• •••• 4242
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Expires 12/2025
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                        Default
                      </span>
                    </div>
                  </div>
            
                  {/* Billing Portal Button */}
                  <div className="space-y-4">
                    <button
                      onClick={handleManageBilling}
                      className="flex items-center justify-center w-full px-4 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                    >
                      <span>Manage Billing</span>
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2" />
                    </button>
                    
                    <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Square Data Explorer partners with Stripe for simplified billing. 
                        By clicking "Manage Billing," you will be redirected to Stripe's secure website 
                        to manage your billing details.
                      </p>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 4,
              name: "Appearance",
              icon: <ComputerDesktopIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
              isOpen: false,
              content: (
                <div className="space-y-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose your preferred theme for the dashboard.
                  </p>
                  
                  <div className="grid gap-4">
                    {/* Light Theme Button */}
                    <button
                      onClick={() => setTheme('light')}
                      className={`relative flex items-center rounded-lg border-2 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        theme === 'light'
                          ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md mr-4">
                          <SunIcon className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Light Theme
                          </p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                            Light mode for bright environments
                          </p>
                        </div>
                      </div>
                      {theme === 'light' && (
                        <div className="ml-4 flex-shrink-0">
                          <div className="h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                        </div>
                      )}
                    </button>
            
                    {/* Dark Theme Button */}
                    <button
                      onClick={() => setTheme('dark')}
                      className={`relative flex items-center rounded-lg border-2 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        theme === 'dark'
                          ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md mr-4">
                          <MoonIcon className="h-5 w-5 text-indigo-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Dark Theme
                          </p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                            Dark mode for reduced eye strain
                          </p>
                        </div>
                      </div>
                      {theme === 'dark' && (
                        <div className="ml-4 flex-shrink-0">
                          <div className="h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                        </div>
                      )}
                    </button>
            
                    {/* System Theme Button */}
                    <button
                      onClick={() => setTheme('system')}
                      className={`relative flex items-center rounded-lg border-2 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        theme === 'system'
                          ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md mr-4">
                          <ComputerDesktopIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            System Theme
                          </p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                            Automatically match system preferences
                          </p>
                        </div>
                      </div>
                      {theme === 'system' && (
                        <div className="ml-4 flex-shrink-0">
                          <div className="h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                        </div>
                      )}
                    </button>
                  </div>
            
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      The system theme will automatically switch between light and dark mode based on your device settings.
                      You can override this by selecting a specific theme above.
                    </p>
                  </div>
                </div>
              ),
            },
          ]);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [theme]);

  return (
    <main className="flex-1 bg-gray-100 dark:bg-gray-900 min-h-screen overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account preferences and settings.
          </p>
        </div>

        <div className="space-y-6">
        {sections.map((section) => (
  <div 
    key={section.id} 
    className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg overflow-hidden"
  >
    <button
      className="w-full"
      onClick={() => toggleSection(section.id)}
    >
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-4">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            {section.icon}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {section.name}
            </h3>
          </div>
        </div>
        <div className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
          section.isOpen ? 'rotate-180' : ''
        }`}>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </div>
    </button>
    
    {section.isOpen && (
      <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700">
        <div className="pt-6">
          {section.content}
        </div>
      </div>
    )}
  </div>
))}
        </div>
      </div>

      {/* Password Change Modal */}
      {/* Password Change Modal */}
{modalOpen && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    <div className="min-h-screen px-4 text-center">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleModalClose}
      ></div>

      {/* Modal positioning */}
      <div className="fixed inset-0 flex items-center justify-center">
        {/* Modal content */}
        <div className="relative bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-2xl p-6 text-left transform transition-all">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Change Password
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Please enter your current password and choose a new one.
            </p>
          </div>

          {/* Status Messages */}
          {passwordChangeSuccess && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-900 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">
                Password changed successfully.
              </p>
            </div>
          )}

          {passwordChangeError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                {passwordChangeError}
              </p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible.current ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white transition-colors"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
                >
                  {isPasswordVisible.current ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible.new ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white transition-colors"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
                >
                  {isPasswordVisible.new ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible.confirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white transition-colors"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
                >
                  {isPasswordVisible.confirm ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleModalClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordChange}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </main>
  );
}

export default Settings;