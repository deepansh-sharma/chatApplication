import React from "react";
import { Link, useLocation } from "react-router-dom";
import NavLinks from "./NavLinks";
import AuthButtons from "./AuthButtons";

const MobileMenu = ({
  isOpen,
  closeMenu,
  links,
  isAuthenticated,
  user,
  logout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 dark:bg-gray-700 rounded-lg mt-2">
        <NavLinks links={links} isAuthenticated={isAuthenticated} />

        {isAuthenticated ? (
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <div className="flex items-center px-3 py-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-gray-800 dark:text-white">
                  {user?.username}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
            <AuthButtons />
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
