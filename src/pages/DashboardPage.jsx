import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, TrendingUp, Users, ArrowRight, User } from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";

const DashboardPage = ({ user }) => {
  const [stats, setStats] = useState({ activeRequests: 0, solvedRequests: 0, score: user?.trustScore || 0 });
  const [recent, setRecent] = useState([]);
  
  useEffect(() => {
    // In a real app, we'd fetch dashboard stats from a specific endpoint
    // We'll mock it by fetching all requests and filtering
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(API_ENDPOINTS.REQUESTS);
        if (data.success) {
          const myRequests = data.data.filter(r => r.createdBy._id === user?._id || r.createdBy === user?._id);
          setStats({
            activeRequests: myRequests.filter(r => r.status === "Open").length,
            solvedRequests: myRequests.filter(r => r.status === "Solved").length,
            score: user?.trustScore || 0
          });
          setRecent(myRequests.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchStats();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      
      {/* Header with Profile Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-[#1a2e2a]">My Dashboard</h1>
        <Link 
          to="/profile"
          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-3 shadow-sm"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-6 h-6 rounded-md object-cover" />
          ) : (
            <User size={16} />
          )}
          View Profile
        </Link>
      </div>
      
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a2e2a] text-white p-12 md:p-16 rounded-[2.5rem] shadow-sm relative overflow-hidden"
      >
        <div className="relative z-10">
          <span className="text-xs font-bold tracking-widest text-[#14b8a6] uppercase mb-4 block">DEMO SESSION ACTIVE</span>
          <h1 className="text-[48px] font-extrabold mb-4 leading-[1.1] tracking-tight">Welcome back, {user?.name}.</h1>
          <p className="text-lg text-gray-300 font-medium max-w-2xl mb-10">
            Your profile is currently active in the community. You can track your trust score, view contribution history, and manage how you appear to others.
          </p>
          
          <div className="flex flex-wrap gap-12">
            <div>
              <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">TRUST SCORE</div>
              <div className="text-4xl font-extrabold">{user?.trustScore || 100}</div>
            </div>
            <div>
              <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">CONTRIBUTIONS</div>
              <div className="text-4xl font-extrabold">{user?.contributions || 0}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
          <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">VISIBILITY</div>
          <h3 className="text-4xl font-extrabold text-[#1a2e2a] mb-3">Public</h3>
          <p className="text-gray-500 text-[14px] font-medium leading-relaxed">
            Your community profile is currently visible to all members and helpers.
          </p>
          <Link to="/profile" className="text-[#115e59] font-bold text-sm mt-8 flex items-center gap-2 hover:gap-3 transition-all">
            View profile →
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
          <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">CONTRIBUTIONS</div>
          <h3 className="text-4xl font-extrabold text-[#1a2e2a] mb-3">{user?.contributions || 0}</h3>
          <p className="text-gray-500 text-[14px] font-medium leading-relaxed">
            The total number of requests you have solved or supported within the loop.
          </p>
          <Link to="/leaderboard" className="text-[#115e59] font-bold text-sm mt-8 flex items-center gap-2 hover:gap-3 transition-all">
            View history →
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
          <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">MANAGEMENT</div>
          <h3 className="text-4xl font-extrabold text-[#1a2e2a] mb-3">Edit</h3>
          <p className="text-gray-500 text-[14px] font-medium leading-relaxed">
            Update your expertise, contact details, and platform preferences.
          </p>
          <Link to="/profile" className="text-[#115e59] font-bold text-sm mt-8 flex items-center gap-2 hover:gap-3 transition-all">
            Manage profile →
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
