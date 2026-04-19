import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";

const Navbar = ({ isAuthenticated, logout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === "/auth";
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated && !isAuthPage) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, isAuthPage]);

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
      ? "bg-[#2c3d37] text-white px-4 py-1.5 rounded-full text-[13px] font-medium"
      : "text-gray-500 hover:text-gray-800 text-[13px] font-medium px-3 py-1.5 transition-colors";

  return (
    <div className="sticky top-0 z-50 w-full flex justify-center px-10 pb-2 pointer-events-none">
      {/* Frosted glass floating pill */}
      <div
        className="pointer-events-auto w-full max-w-7xl flex items-center justify-between px-10 h-[62px] rounded-lg"
        style={{
          background: "rgba(255, 255, 255, 0.55)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow: "0 2px 20px 0 rgba(0,0,0,0.07), 0 0 0 1px rgba(255,255,255,0.6) inset",
        }}
      >
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="bg-[#0d9d8e] text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[15px]">
            H
          </div>
          <span className="font-semibold text-[14px] tracking-tight text-[#1a2e2a]">HelpHub AI</span>
        </Link>

        {/* Right: Nav Links */}
        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={activeLink("/dashboard")}>Dashboard</Link>
                <Link to="/explore" className={activeLink("/explore")}>Explore</Link>
                {/* <Link to="/leaderboard" className={activeLink("/leaderboard")}>Leaderboard</Link> */}
                <Link to="/messages" className={activeLink("/messages")}>Messages</Link>
                {/* <Link to="/ai-center" className={activeLink("/ai-center")}>AI Center</Link> */}

                {/* Notifications */}
                <div className="relative">
                  <Link to="/notifications" className={activeLink("/notifications")}>
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded-full">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Create Request */}
                <Link
                  to="/create-request"
                  className="ml-1 bg-[#115e59] hover:bg-[#0d4f4a] text-white px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors"
                >
                  Create Request
                </Link>

                {/* <Link to="/profile" className={activeLink("/profile")}>Profile</Link> */}

                {/* Logout icon */}
                <button
                  onClick={handleLogout}
                  className="ml-1 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50/60 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <Link to="/" className={activeLink("/")}>Home</Link>
                <Link to="/explore" className={activeLink("/explore")}>Explore</Link>
                <Link to="/leaderboard" className={activeLink("/leaderboard")}>Leaderboard</Link>
                <Link to="/ai-center" className={activeLink("/ai-center")}>AI Center</Link>
                <Link to="/ai-center" className="text-gray-500 bg-yellow-30 rounded-full hover:text-gray-800 text-[13px] font-medium px-3 py-1.5 transition-colors">
                  Live community signals
                </Link>
                <Link
                  to="/auth"
                  className="ml-1 bg-[#115e59] hover:bg-[#0d4f4a] text-white px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors"
                >
                  Join the platform
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;