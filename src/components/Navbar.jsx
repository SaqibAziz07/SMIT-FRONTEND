import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LogOut, Menu, X, Bell, User, LayoutDashboard, Zap } from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";
import "./Navbar.css";

const Navbar = ({ isAuthenticated, user, logout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === "/auth";
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isAuthPage) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, isAuthPage]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_ENDPOINTS.NOTIFICATIONS}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const activeLink = (path) =>
    location.pathname === path
      ? "text-[#0d7377] font-semibold px-3.5 py-2 rounded-lg transition-all duration-200 relative"
      : "text-gray-600 hover:text-gray-900 px-3.5 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100/50";

  return (
    <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 pointer-events-none">
      <div className="pointer-events-auto max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo + Brand */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="bg-gradient-to-br from-[#129F8A] to-[#0d7377] text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-300">
            H
          </div>
          <span className="font-bold text-base tracking-tight text-[#1a2e2a] group-hover:text-[#0d7377] transition-colors duration-300">HelpHub AI</span>
        </Link>

        {/* Desktop Nav Links — Center */}
        {!isAuthPage && (
          <div className="hidden lg:flex items-center gap-0.5">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={activeLink("/dashboard")}>Dashboard</Link>
                <Link to="/explore" className={activeLink("/explore")}>Explore</Link>
                <Link to="/messages" className={activeLink("/messages")}>Messages</Link>
                <Link to="/ai-center" className={activeLink("/ai-center")}>AI Center</Link>
              </>
            ) : (
              <>
                <Link to="/" className={activeLink("/")}>Home</Link>
                <Link to="/explore" className={activeLink("/explore")}>Explore</Link>
                <Link to="/leaderboard" className={activeLink("/leaderboard")}>Leaderboard</Link>
                <Link to="/ai-center" className={activeLink("/ai-center")}>AI Center</Link>
              </>
            )}
          </div>
        )}

        {/* Desktop Right Actions */}
        {!isAuthPage && (
          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Create Request */}
                <Link
                  to="/create-request"
                  className="bg-[#0d7377] hover:bg-[#0d5a66] text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg"
                  style={{ transform: 'translateZ(0)' }}
                >
                  Create Request
                </Link>

                {/* Notifications Icon */}
                <Link 
                  to="/notifications" 
                  className="relative p-2.5 text-gray-600 hover:text-[#0d7377] hover:bg-blue-50 rounded-xl transition-all duration-300"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded-full shadow-lg animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-2xl transition-all duration-300"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#0d7377]/10" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#129F8A] to-[#0d7377] text-white flex items-center justify-center font-bold text-sm">
                        {user?.name?.charAt(0).toUpperCase() || <User size={20} />}
                      </div>
                    )}
                  </button>

                  {dropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 pointer-events-auto">
                        <div className="p-2">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#0d7377] hover:bg-blue-50 text-sm transition-all duration-200 rounded-xl"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <User size={18} />
                            <span className="font-medium">Profile</span>
                          </Link>
                          <Link
                            to="/leaderboard"
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#0d7377] hover:bg-blue-50 text-sm transition-all duration-200 rounded-xl"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <Zap size={18} />
                            <span className="font-medium">Leaderboard</span>
                          </Link>
                          <div className="border-t border-gray-100 my-2"></div>
                          <button
                            onClick={() => {
                              handleLogout();
                              setDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 text-sm transition-all duration-200 rounded-xl font-medium"
                          >
                            <LogOut size={18} />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Live Community Signals */}
                <Link
                  to="/explore"
                  className="flex items-center gap-2 border border-[#0d7377] text-[#0d7377] hover:bg-[#e2f1ec] px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
                >
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Live Community Signals
                </Link>
                {/* Join the Platform */}
                <Link
                  to="/auth"
                  className="bg-[#0d7377] hover:bg-[#0d5a66] text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg"
                  style={{ transform: 'translateZ(0)' }}
                >
                  Join the Platform
                </Link>
              </>
            )}
          </div>
        )}

        {/* Mobile Menu Toggle Button */}
        {!isAuthPage && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 text-gray-600 hover:text-[#0d7377] hover:bg-gray-100 rounded-xl transition-all duration-300"
            title={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {!isAuthPage && mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 lg:hidden z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Animated Mobile Menu */}
          <div
            className="fixed top-16 left-0 right-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/50 pointer-events-auto lg:hidden z-45 animate-in slide-in-from-top-2 duration-300"
          >
            <div className="flex flex-col gap-1 p-4 max-h-[calc(100vh-80px)] overflow-y-auto">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === "/dashboard"
                        ? "bg-[#0d7377] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/explore" 
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === "/explore"
                        ? "bg-[#0d7377] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Explore
                  </Link>
                  <Link 
                    to="/messages" 
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === "/messages"
                        ? "bg-[#0d7377] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Messages
                  </Link>
                  <Link 
                    to="/ai-center" 
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === "/ai-center"
                        ? "bg-[#0d7377] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    AI Center
                  </Link>
                  <Link 
                    to="/notifications" 
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                      location.pathname === "/notifications"
                        ? "bg-[#0d7377] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Bell size={18} />
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded-full">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>
                  <div className="my-2 border-t border-gray-200" />
                  <Link
                    to="/profile"
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      location.pathname === "/profile"
                        ? "bg-[#0d7377] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-6 h-6 rounded-md object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center text-[10px] font-bold">
                        {user?.name?.charAt(0).toUpperCase() || <User size={14} />}
                      </div>
                    )}
                    Profile
                  </Link>
                  <Link
                    to="/leaderboard"
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      location.pathname === "/leaderboard"
                        ? "bg-[#0d7377] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Zap size={18} />
                    Leaderboard
                  </Link>
                  <div className="my-2 border-t border-gray-200" />
                  <Link
                    to="/create-request"
                    className="py-3 px-4 rounded-lg text-sm font-semibold bg-[#0d7377] text-white hover:bg-[#0d5a66] transition-all duration-200"
                  >
                    Create Request
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 px-4 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all duration-200 text-left flex items-center gap-2 font-medium"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/" 
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === "/"
                        ? "bg-[#0d7377] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/explore" 
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === "/explore"
                        ? "bg-[#0d7377] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Explore
                  </Link>
                  <Link 
                    to="/leaderboard" 
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === "/leaderboard"
                        ? "bg-[#0d7377] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Leaderboard
                  </Link>
                  <Link 
                    to="/ai-center" 
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === "/ai-center"
                        ? "bg-[#0d7377] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    AI Center
                  </Link>
                  <div className="my-2 border-t border-gray-200" />
                  <Link
                    to="/explore"
                    className="py-3 px-4 rounded-lg text-sm font-semibold border border-[#0d7377] text-[#0d7377] hover:bg-[#e2f1ec] transition-all duration-200 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Live Community Signals
                  </Link>
                  <Link
                    to="/auth"
                    className="py-3 px-4 rounded-lg text-sm font-semibold bg-[#0d7377] text-white hover:bg-[#0d5a66] transition-all duration-200"
                  >
                    Join the Platform
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;