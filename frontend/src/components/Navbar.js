import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { useAuth } from "../context/AuthContext";
import Logo from "./navbar/Logo";
import NavLinks from "./navbar/NavLinks";
import ThemeToggle from "./navbar/ThemeToggle";
import AuthButtons from "./navbar/AuthButtons";
import ProfileDropdown from "./navbar/ProfileDropdown";
import MobileMenuButton from "./navbar/MobileMenuButton";
import MobileMenu from "./navbar/MobileMenu";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate(); // 2. Initialize useNavigate

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/", showWhenAuth: false },
    { name: "Dashboard", path: "/dashboard", showWhenAuth: true },
    { name: "Features", path: "/#features", showWhenAuth: false },
    { name: "Pricing", path: "/#pricing", showWhenAuth: false },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <NavLinks links={navLinks} isAuthenticated={isAuthenticated} />
            <ThemeToggle />
            {isAuthenticated ? (
              <ProfileDropdown
                user={user}
                isOpen={isProfileOpen}
                toggle={toggleProfile}
                logout={handleLogout}
              />
            ) : (
              <AuthButtons />
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <MobileMenuButton isOpen={isMenuOpen} toggle={toggleMenu} />
          </div>
        </div>

        <MobileMenu
          isOpen={isMenuOpen}
          closeMenu={closeMenu}
          links={navLinks}
          isAuthenticated={isAuthenticated}
          user={user}
          logout={handleLogout}
        />
      </div>

      {(isProfileOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            closeProfile();
            closeMenu();
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
