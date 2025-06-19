import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoPlaceholder from '../assets/logo-placeholder';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  // Add shadow to navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 backdrop-blur-lg shadow-lg shadow-gray-300/30' : 'bg-gradient-to-br from-gray-50/90 via-gray-100/85 to-gray-200/80 backdrop-blur-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,theme(colors.gray.300/5%),theme(colors.gray.400/5%),theme(colors.gray.300/5%))] opacity-30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.white/30%),transparent_70%)] backdrop-blur-xl"></div>
        
        <div className="flex justify-between h-20 items-center relative">
          {/* Logo and brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center group">
              <LogoPlaceholder className="h-10 w-auto transition-all duration-300 group-hover:scale-110" />
            </Link>
          </div>

          {/* Desktop navigation links */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <Link to="/" className="text-[15px] text-gray-700 hover:text-gray-900 hover:scale-105 transform transition-all duration-300 px-4 py-2 relative group">
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-gray-700 to-gray-900 group-hover:w-full transition-all duration-300"></span>
              Home
            </Link>
            <Link to="/browse" className="text-[15px] text-gray-700 hover:text-gray-900 hover:scale-105 transform transition-all duration-300 px-4 py-2 relative group">
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-gray-700 to-gray-900 group-hover:w-full transition-all duration-300"></span>
              Browse Products
            </Link>
            <Link to="/about" className="text-[15px] text-gray-700 hover:text-gray-900 hover:scale-105 transform transition-all duration-300 px-4 py-2 relative group">
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-gray-700 to-gray-900 group-hover:w-full transition-all duration-300"></span>
              About Us
            </Link>
            <Link to="/contact" className="text-[15px] text-gray-700 hover:text-gray-900 hover:scale-105 transform transition-all duration-300 px-4 py-2 relative group">
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-gray-700 to-gray-900 group-hover:w-full transition-all duration-300"></span>
              Contact Us
            </Link>
          </div>

          {/* User authentication section */}
          <div className="hidden md:flex md:items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors duration-300 bg-gray-700/5 backdrop-blur-sm rounded-xl px-4 py-2 hover:bg-gray-700/10"
                >
                  <img
                    src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=random'}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover border border-gray-300"
                  />
                  <span className="font-medium">{user.name}</span>
                </button>

                {/* Profile dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white backdrop-blur-xl rounded-xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.2)] py-2 z-10 border border-gray-200 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.gray.100/50%),transparent_70%)]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,theme(colors.gray.200/50%),transparent_70%)]"></div>
                      <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,theme(colors.gray.100/30%),theme(colors.gray.200/30%),theme(colors.gray.100/30%))] opacity-30"></div>
                    </div>
                    <div className="px-4 pb-2 mb-1 border-b border-gray-200 relative">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex w-full items-center px-4 py-2 text-[13px] text-gray-700 hover:text-white group/item transition-all duration-300 relative overflow-hidden hover:bg-gradient-to-r hover:from-gray-700 hover:via-gray-800 hover:to-gray-700 hover:shadow-sm"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/my-rentals"
                      className="flex w-full items-center px-4 py-2 text-[13px] text-gray-700 hover:text-white group/item transition-all duration-300 relative overflow-hidden hover:bg-gradient-to-r hover:from-gray-700 hover:via-gray-800 hover:to-gray-700 hover:shadow-sm"
                    >
                      My Rentals
                    </Link>
                    <Link
                      to="/add-product"
                      className="flex w-full items-center px-4 py-2 text-[13px] text-gray-700 hover:text-white group/item transition-all duration-300 relative overflow-hidden hover:bg-gradient-to-r hover:from-gray-700 hover:via-gray-800 hover:to-gray-700 hover:shadow-sm"
                    >
                      Add Product
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-[13px] text-gray-700 hover:text-white group/item transition-all duration-300 relative overflow-hidden hover:bg-gradient-to-r hover:from-gray-700 hover:via-gray-800 hover:to-gray-700 hover:shadow-sm"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors duration-300 bg-gray-700/5 backdrop-blur-sm rounded-lg px-5 py-2 hover:bg-gray-700/10 border border-gray-300/50 hover:border-gray-400/70">
                  Login
                </Link>
                <Link to="/register" className="relative px-5 py-2 text-[15px] font-medium text-white tracking-wide rounded-lg bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 transition-all duration-500 shadow-lg shadow-gray-400/20 hover:shadow-xl hover:shadow-gray-500/30 hover:-translate-y-0.5 border border-gray-600/10 group/btn">
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.white/30%),transparent_50%)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></span>
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2.5 text-gray-700 hover:text-white rounded-xl transition-all duration-300 focus:outline-none relative overflow-hidden group hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-800"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-5 pt-4 pb-6 space-y-1.5 bg-white backdrop-blur-xl border-t border-gray-200 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.2)] rounded-b-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,theme(colors.gray.100/50%),transparent_70%)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,theme(colors.gray.200/50%),transparent_70%)]"></div>
              <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,theme(colors.gray.100/30%),theme(colors.gray.200/30%),theme(colors.gray.100/30%))] opacity-30"></div>
            </div>
            <div className="relative flex justify-center mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-70"></div>
            </div>
            <Link
              to="/"
              className="block w-full px-5 py-3 text-[15px] font-medium text-gray-700 hover:text-white rounded-xl transition-all duration-300 relative overflow-hidden group hover:bg-gradient-to-r hover:from-gray-700 hover:via-gray-800 hover:to-gray-700 hover:shadow-md"
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="block w-full px-5 py-3 text-[15px] font-medium text-gray-700 hover:text-white rounded-xl transition-all duration-300 relative overflow-hidden group hover:bg-gradient-to-r hover:from-gray-700 hover:via-gray-800 hover:to-gray-700 hover:shadow-md"
            >
              Browse Products
            </Link>
            <Link
              to="/about"
              className="block w-full px-5 py-3 text-[15px] font-medium text-gray-700 hover:text-white rounded-xl transition-all duration-300 relative overflow-hidden group hover:bg-gradient-to-r hover:from-gray-700 hover:via-gray-800 hover:to-gray-700 hover:shadow-md"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="block w-full px-5 py-3 text-[15px] font-medium text-gray-700 hover:text-white rounded-xl transition-all duration-300 relative overflow-hidden group hover:bg-gradient-to-r hover:from-gray-700 hover:via-gray-800 hover:to-gray-700 hover:shadow-md"
            >
              Contact Us
            </Link>
            
            {/* Mobile authentication */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              {user ? (
                <div className="space-y-1.5">
                  <div className="flex items-center px-5 py-3">
                    <img
                      src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=random'}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover border border-gray-300"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="block w-full px-5 py-3 text-[15px] font-medium text-gray-700 hover:text-white rounded-xl transition-all duration-300 relative overflow-hidden group hover:bg-gradient-to-r hover:from-gray-700 hover:via-gray-800 hover:to-gray-700 hover:shadow-md"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/my-rentals"
                    className="block w-full px-5 py-3 text-[15px] font-medium text-gray-700 hover:text-white rounded-xl transition-all duration-300 relative overflow-hidden group hover:bg-gradient-to-r hover:from-gray-700 hover:via-gray-800 hover:to-gray-700 hover:shadow-md"
                  >
                    My Rentals
                  </Link>
                  <Link
                    to="/add-product"
                    className="block w-full px-5 py-3 text-[15px] font-medium text-gray-700 hover:text-white rounded-xl transition-all duration-300 relative overflow-hidden group hover:bg-gradient-to-r hover:from-gray-700 hover:via-gray-800 hover:to-gray-700 hover:shadow-md"
                  >
                    Add Product
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-5 py-3 text-[15px] font-medium text-gray-700 hover:text-white rounded-xl transition-all duration-300 relative overflow-hidden group hover:bg-gradient-to-r hover:from-gray-700 hover:via-gray-800 hover:to-gray-700 hover:shadow-md"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 px-5">
                  <Link
                    to="/login"
                    className="flex justify-center items-center px-4 py-3 text-[15px] font-medium text-gray-700 hover:text-gray-900 rounded-xl transition-all duration-300 relative overflow-hidden group hover:bg-gray-100 border border-gray-300/50 hover:border-gray-400/70"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex justify-center items-center px-4 py-3 text-[15px] font-medium text-white rounded-xl bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 transition-all duration-500 shadow-lg shadow-gray-400/20 hover:shadow-xl hover:shadow-gray-500/30 border border-gray-600/10 group/btn"
                  >
                    <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.white/30%),transparent_50%)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></span>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;