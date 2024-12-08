import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, provider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore imports
import { CircleStackIcon } from "@heroicons/react/24/outline";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Create user with email and password
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date(),
        emailVerified: user.emailVerified,
      });

      // Send verification email
      await sendEmailVerification(user);
      console.log("Verification email sent");

      navigate("/verification-check");
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError(
            <div>
              An account with this email already exists.{" "}
              <button
                onClick={() => navigate("/login", { state: { email } })}
                className="text-blue-600 hover:underline"
              >
                Click here to login
              </button>
            </div>
          );
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters long.");
          break;
        default:
          setError(err.message);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user already exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Save user data in Firestore
        await setDoc(userRef, {
          name: user.displayName || "Google User",
          email: user.email,
          createdAt: new Date(),
          emailVerified: user.emailVerified,
        });
      }

      console.log("Google sign-in successful:", user);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to sign up with Google. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Section */}
        <div className="hidden md:flex bg-blue-600 text-white flex-col justify-center items-center p-8">
          <CircleStackIcon className="h-16 w-16 mb-4" />
          <h2 className="text-2xl font-bold">Square Data Explorer</h2>
          <p className="text-center mt-4">Explore your data with ease and efficiency.</p>
        </div>

        {/* Right Section */}
        <div className="p-6 md:p-12">
          <h2 className="text-2xl font-bold text-gray-700 text-center">Create Your Account</h2>
          <p className="text-center text-sm text-gray-500 mt-2">
            Start your journey with us today.
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 mt-4 rounded-md text-center">
              {error}
            </div>
          )}

          {/* Google Sign-Up Button */}
          <div className="mt-6">
            <button
              onClick={handleGoogleSignUp}
              className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="h-5 w-5 mr-2"
              />
              Sign up with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Sign-Up Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Jane Doe"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g. jane@example.com"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Agree to Terms Checkbox */}
            <div className="flex items-start">
              <input
                id="agree-to-terms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="agree-to-terms" className="ml-2 text-sm text-gray-700">
                By signing up, you are creating a Square Data Explorer account, and you agree to
                Square Data Explorer’s{" "}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms of Use
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>.
              </label>
            </div>

            {/* Sign-Up Button */}
            <button
              type="submit"
              disabled={!agreeToTerms}
              className={`w-full py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                agreeToTerms
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Create Account
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login", { state: { email } })}
              className="text-blue-600 hover:underline font-medium"
            >
              Log in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
