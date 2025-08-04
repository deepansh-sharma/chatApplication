import React from "react";
import { Link } from "react-router-dom";

const ProfileDropdown = ({ user, isOpen, toggle, logout }) => (
  <div className="relative z-50">
    <button
      onClick={toggle}
      className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
    >
      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
        <span className="text-white text-sm font-semibold">
          {user?.username?.charAt(0).toUpperCase()}
        </span>
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {user?.username}
      </span>
      <svg
        className={`w-4 h-4 text-gray-400 dark:text-gray-500 transform transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    {isOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2">
        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-600">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.username}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </p>
        </div>
        <Link
          to="/dashboard"
          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={toggle}
        >
          Dashboard
        </Link>
        <button
          onClick={logout}
          className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          Logout
        </button>
      </div>
    )}
  </div>
);

export default ProfileDropdown;
