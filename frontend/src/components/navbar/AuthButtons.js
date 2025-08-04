import React from "react";
import { Link } from "react-router-dom";

const AuthButtons = () => (
  <div className="flex items-center space-x-4">
    <Link
      to="/login"
      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-md text-sm font-medium transition-colors"
    >
      Sign In
    </Link>
    <Link
      to="/signup"
      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-md"
    >
      Get Started
    </Link>
  </div>
);

export default AuthButtons;
