import React, { useState, useEffect } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  UserIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { auth, db } from "../config/firebase";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function Settings() {
  const [sections, setSections] = useState([
    {
      id: 1,
      name: "Account Information",
      icon: <UserIcon className="h-6 w-6 text-blue-600" />,
      content: <div className="space-y-4">Loading...</div>, // Placeholder for user data
      isOpen: true,
    },
    {
      id: 2,
      name: "Security Settings",
      icon: <LockClosedIcon className="h-6 w-6 text-blue-600" />,
      content: null, // This will be populated with the Change Password feature
      isOpen: false,
    },
  ]);

  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userRef = doc(db, "users", auth.currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);

            // Update the Account Information section with user data
            setSections((prevSections) =>
              prevSections.map((section) =>
                section.id === 1
                  ? {
                      ...section,
                      content: (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">
                              Full Name
                            </span>
                            <span className="text-sm text-gray-900">
                              {data.name || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">
                              Email Address
                            </span>
                            <span className="text-sm text-gray-900">
                              {data.email || "N/A"}
                            </span>
                          </div>
                        </div>
                      ),
                    }
                  : section
              )
            );
          } else {
            console.log("No user data found.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  // Toggle Section
  const toggleSection = (id) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id ? { ...section, isOpen: !section.isOpen } : section
      )
    );
  };

  // Open Change Password Modal
  const handleOpenChangePassword = () => {
    setIsModalOpen(true);
    setError("");
    setSuccess("");
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setError("");
    setSuccess("");
  };

  // Handle Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const user = auth.currentUser;

    if (!user) {
      setError("No user is currently logged in.");
      return;
    }

    try {
      // Re-authenticate the user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update the password
      await updatePassword(user, newPassword);
      setSuccess("Password updated successfully!");
      handleCloseModal();
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        setError("Current password is incorrect.");
      } else if (err.code === "auth/weak-password") {
        setError("New password should be at least 6 characters long.");
      } else {
        setError("Failed to update password. Please try again.");
      }
    }
  };

  return (
    <main className="flex-1 bg-gray-100 p-6 h-screen">
      <h2 className="text-3xl font-bold mb-4">Settings</h2>
      <p className="text-gray-700 mb-6">
        Manage your account preferences and settings.
      </p>

      {/* Settings Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="bg-white shadow-md rounded-md p-4">
            {/* Section Header */}
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

            {/* Section Content */}
            {section.isOpen && (
              <div className="mt-4 border-t pt-4">
                {section.id === 2 ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Password
                    </span>
                    <button
                      onClick={handleOpenChangePassword}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Change Password
                    </button>
                  </div>
                ) : (
                  section.content
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Change Password Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>

            {error && (
              <div className="bg-red-100 text-red-600 p-3 mb-4 rounded-md text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 text-green-600 p-3 mb-4 rounded-md text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password */}
              <div>
                <label
                  htmlFor="current-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Update Password
              </button>
            </form>

            <button
              onClick={handleCloseModal}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Settings;
