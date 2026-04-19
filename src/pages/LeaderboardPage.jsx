import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Award, TrendingUp } from "lucide-react";
import axios from "axios";

const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/users/leaderboard");
        if (data.success) {
          setLeaders(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div className="text-center bg-[#1a2e2a] text-white p-12 rounded-[2.5rem] relative overflow-hidden shadow-md">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#f0c040] rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#14b8a6] rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        
        <div className="relative z-10">
          <Trophy size={48} className="mx-auto text-[#f0c040] mb-4" />
          <h1 className="text-4xl font-extrabold mb-2">Community Leaders</h1>
          <p className="text-gray-300">Top helpers ranked by Trust Score and Contributions.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-4 md:p-8">
        {loading ? (
          <div className="flex justify-center p-12"><div className="w-10 h-10 border-4 border-[#14b8a6]/30 border-t-[#14b8a6] rounded-full animate-spin"></div></div>
        ) : leaders.length > 0 ? (
          <div className="flex flex-col gap-4">
            {leaders.map((user, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                key={user._id}
                className={`flex flex-col md:flex-row justify-between items-center p-5 rounded-2xl border ${i < 3 ? 'border-[#f0c040]/30 bg-[#f0c040]/5' : 'border-gray-100'} transition-all`}
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className={`w-12 h-12 flex items-center justify-center font-black text-xl rounded-full ${i === 0 ? 'bg-[#f0c040] text-white shadow-lg shadow-[#f0c040]/30' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-orange-300 text-orange-900' : 'bg-gray-50 text-gray-400 border border-gray-200'}`}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-[#1a2e2a] flex items-center gap-2">
                      {user.name} {i < 3 && <Star size={16} fill="currentColor" className="text-[#f0c040]" />}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {user.skills?.slice(0, 3).map((skill, j) => (
                        <span key={j} className="text-xs text-gray-500 bg-white border border-gray-200 px-2 rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 mt-4 md:mt-0 w-full md:w-auto justify-end border-t md:border-none pt-4 md:pt-0 border-gray-100">
                  <div className="text-center">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Solved</span>
                    <span className="font-extrabold text-lg flex items-center justify-center gap-1"><Award size={16} className="text-[#14b8a6]" /> {user.contributions}</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Trust</span>
                    <span className="font-extrabold text-lg flex items-center justify-center gap-1"><TrendingUp size={16} className="text-[#115e59]" /> {user.trustScore}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">No leaders found yet. Be the first to help!</div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
