import React, { useState, useEffect } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  UserIcon,
  CreditCardIcon,
  ArrowTopRightOnSquareIcon,
  EyeIcon,
  EyeSlashIcon, ArrowsPointingInIcon,
} from "@heroicons/react/24/outline";
import { auth, db } from "../config/firebase";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function Settings() {
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
              icon: <UserIcon className="h-6 w-6 text-blue-600" />,
              isOpen: false,
              content: (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Full Name
                    </span>
                    <span className="text-sm text-gray-900">{accountInfo.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Email Address
                    </span>
                    <span className="text-sm text-gray-900">{accountInfo.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Account Created On
                    </span>
                    <span className="text-sm text-gray-900">
                      {securityInfo.accountCreatedOn}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Last Login
                    </span>
                    <span className="text-sm text-gray-900">{securityInfo.lastLogin}</span>
                  </div>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Change Password
                  </button>
                </div>
              ),
            },
            {
              id: 2,
              name: "Square Integration",
              icon: <ArrowsPointingInIcon className="h-6 w-6 text-blue-600" />,
              isOpen: false,
              content: (
                <div className="space-y-4">
                  {isConnectedToSquare ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        Connected to Square successfully.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Account Name
                        </span>
                        <span className="text-sm text-gray-900">
                          {connectionDetails?.accountName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Connected At
                        </span>
                        <span className="text-sm text-gray-900">
                          {connectionDetails?.connectedAt}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        Connect your account to Square to enable additional
                        functionalities.
                      </p>
                      <button
                        onClick={handleSquareConnection}
                        className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
              icon: <CreditCardIcon className="h-6 w-6 text-blue-600" />,
              isOpen: false,
              content: (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Subscription Plan
                    </span>
                    <span className="text-sm text-gray-900">Premium Plan</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Billing Frequency
                    </span>
                    <span className="text-sm text-gray-900">Monthly</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Payment Amount
                    </span>
                    <span className="text-sm text-gray-900">$29.99</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Next Billing Date
                    </span>
                    <span className="text-sm text-gray-900">2024-12-15</span>
                  </div>
                  <button
                    onClick={handleManageBilling}
                    className="flex items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <span>Manage Billing</span>
                    <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                  </button>
                  <p className="text-sm text-gray-700">
                    Square Data Explorer partners with Stripe for simplified
                    billing. By clicking "Manage Billing," you will be
                    redirected to Stripe's secure website to manage your billing
                    details.
                  </p>
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
  }, []);

  return (
    <main className="flex-1 bg-gray-100 p-6 min-h-screen overflow-y-auto">
      <h2 className="text-3xl font-bold mb-4">Settings</h2>
      <p className="text-gray-700 mb-6">
        Manage your account preferences and settings.
      </p>
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="bg-white shadow-md rounded-md p-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center space-x-4">
                {section.icon}
                <h3 className="text-lg font-bold">{section.name}</h3>
              </div>
              {section.isOpen ? (
                <ChevronUpIcon className="h-6 w-6 text-gray-600" />
              ) : (
                <ChevronDownIcon className="h-6 w-6 text-gray-600" />
              )}
            </div>
            {section.isOpen && (
              <div className="mt-4 border-t pt-4">{section.content}</div>
            )}
          </div>
        ))}
      </div>

      {/* Password Change Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 space-y-4">
            <h3 className="text-lg font-bold">Change Password</h3>
            {passwordChangeSuccess && (
              <p className="text-sm text-green-600">Password changed successfully.</p>
            )}
            {passwordChangeError && (
              <p className="text-sm text-red-600">{passwordChangeError}</p>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible.current ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute inset-y-0 right-2 flex items-center"
                >
                  {isPasswordVisible.current ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible.new ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute inset-y-0 right-2 flex items-center"
                >
                  {isPasswordVisible.new ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible.confirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute inset-y-0 right-2 flex items-center"
                >
                  {isPasswordVisible.confirm ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={handlePasswordChange}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Settings;