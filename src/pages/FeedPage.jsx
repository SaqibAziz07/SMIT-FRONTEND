import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, Search, TrendingUp } from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";

const FeedPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await axios.get(API_ENDPOINTS.REQUESTS);
        if (data.success) {
          setRequests(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter(r => {
    if (filter === "All") return true;
    if (filter === "Open") return r.status === "Open";
    if (filter === "Solved") return r.status === "Solved";
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1a2e2a]">Community Feed</h1>
          <p className="text-gray-500 mt-2">Discover problems currently in motion and find where you can help.</p>
        </div>
        <div className="flex gap-3 items-center">
          <Link 
            to="/leaderboard"
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <TrendingUp size={16} />
            Leaderboard
          </Link>
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            {["All", "Open", "Solved"].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === f ? 'bg-[#1a2e2a] text-white shadow-sm' : 'text-gray-500 hover:text-[#1a2e2a]'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-10 h-10 border-4 border-[#14b8a6]/30 border-t-[#14b8a6] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={req._id}
              className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-[#115e59]/10 text-[#115e59] px-2.5 py-1 rounded-md text-xs font-bold">{req.category}</span>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${req.status === 'Solved' ? 'bg-gray-100 text-gray-500' : req.urgency === 'High' || req.urgency === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      {req.status === 'Solved' ? 'Solved' : `${req.urgency} Urgency`}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-xl text-[#1a2e2a] mb-2 line-clamp-2">{req.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-6">{req.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {req.tags?.slice(0,3).map((tag, j) => (
                    <span key={j} className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold tracking-wider">POSTED BY</span>
                  <span className="text-sm font-semibold text-[#1a2e2a]">{req.createdBy?.name || "Anonymous"}</span>
                </div>
                <Link to={`/request/${req._id}`} className="bg-[#1a2e2a] hover:bg-[#115e59] text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                  Open details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedPage;
