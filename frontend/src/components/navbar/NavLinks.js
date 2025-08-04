import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavLinks = ({ links, isAuthenticated }) => {
  const location = useLocation();
  const isActivePage = (path) => location.pathname === path;

  return (
    <>
      {links
        .filter((link) =>
          !isAuthenticated ? !link.showWhenAuth : link.showWhenAuth
        )
        .map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActivePage(link.path)
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {link.name}
          </Link>
        ))}
    </>
  );
};

export default NavLinks;
