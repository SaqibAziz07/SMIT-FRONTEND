import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Award, TrendingUp, Zap, Crown } from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";

// ── helpers ──────────────────────────────────────────────────────────────────
const isOnline = (lastSeen) => {
  if (!lastSeen) return false;
  return Date.now() - new Date(lastSeen).getTime() < 5 * 60 * 1000; // 5 min
};

const Avatar = ({ user, size = "md", rank }) => {
  const sizes = { sm: "w-10 h-10 text-sm", md: "w-14 h-14 text-lg", lg: "w-20 h-20 text-2xl" };
  const medal = rank === 0 ? "ring-4 ring-yellow-400" : rank === 1 ? "ring-4 ring-gray-300" : rank === 2 ? "ring-4 ring-orange-300" : "ring-2 ring-white";
  return (
    <div className={`relative shrink-0`}>
      {user.avatar ? (
        <img src={user.avatar} alt={user.name} className={`${sizes[size]} rounded-full object-cover ${medal}`} />
      ) : (
        <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-[#129F8A] to-[#0d7377] flex items-center justify-center font-bold text-white ${medal}`}>
          {user.name?.charAt(0).toUpperCase()}
        </div>
      )}
      {isOnline(user.lastSeen) && (
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />
      )}
    </div>
  );
};

const medalColors = [
  { bg: "bg-gradient-to-br from-yellow-400 to-yellow-600", text: "text-white", label: "gold" },
  { bg: "bg-gradient-to-br from-gray-300 to-gray-500",    text: "text-white", label: "silver" },
  { bg: "bg-gradient-to-br from-orange-300 to-orange-500", text: "text-white", label: "bronze" },
];

// ── component ─────────────────────────────────────────────────────────────────
const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  })();

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const { data } = await axios.get(`${API_ENDPOINTS.USERS}/leaderboard`);
        if (data.success) setLeaders(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  const myRank = leaders.findIndex(u => u._id === currentUser?._id);
  const podium = leaders.slice(0, 3);
  const rest   = leaders.slice(3);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">

      {/* ── Header ── */}
      <div className="text-center bg-[#1a2e2a] text-white p-12 rounded-[2.5rem] relative overflow-hidden shadow-md">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#f0c040] rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#14b8a6] rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        <div className="relative z-10">
          <Trophy size={48} className="mx-auto text-[#f0c040] mb-4" />
          <h1 className="text-4xl font-extrabold mb-2">Community Leaders</h1>
          <p className="text-gray-300">Ranked by contribution score — help more, rise higher.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-16">
          <div className="w-10 h-10 border-4 border-[#14b8a6]/30 border-t-[#14b8a6] rounded-full animate-spin" />
        </div>
      ) : leaders.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-3xl border border-gray-100">
          No leaders yet. Be the first to help!
        </div>
      ) : (
        <>
          {/* ── Your Rank Banner ── */}
          {myRank !== -1 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#e2f1ec] border border-[#0d7377]/20 rounded-2xl px-6 py-4 flex items-center justify-between"
            >
              <span className="font-bold text-[#0d7377] flex items-center gap-2">
                <Zap size={18} /> Your current rank
              </span>
              <span className="text-2xl font-black text-[#1a2e2a]">#{myRank + 1}</span>
            </motion.div>
          )}

          {/* ── Podium (Top 3) ── */}
          {podium.length > 0 && (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
              <div className="flex items-end justify-center gap-4">
                {/* Reorder to visual podium: 2nd | 1st | 3rd */}
                {[podium[1], podium[0], podium[2]].map((user, vi) => {
                  if (!user) return <div key={vi} className="flex-1" />;
                  const realRank = vi === 0 ? 1 : vi === 1 ? 0 : 2;
                  const heights = ["h-28", "h-36", "h-20"];
                  const mc = medalColors[realRank];
                  return (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: realRank * 0.1 }}
                      className="flex-1 flex flex-col items-center gap-3"
                    >
                      {realRank === 0 && <Crown size={22} className="text-yellow-500 animate-bounce" />}
                      <Avatar user={user} size="lg" rank={realRank} />
                      <div className="text-center">
                        <p className="font-bold text-[#1a2e2a] text-sm">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.role}</p>
                        {isOnline(user.lastSeen) && (
                          <span className="text-[10px] text-green-500 font-semibold">● Online</span>
                        )}
                      </div>
                      <div className={`w-full ${heights[vi]} ${mc.bg} rounded-2xl flex flex-col items-center justify-center gap-1 shadow-md`}>
                        <span className={`text-2xl font-black ${mc.text}`}>#{realRank + 1}</span>
                        <span className={`text-xs font-semibold ${mc.text} opacity-80`}>{user.score} pts</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Rank Table (4th+) ── */}
          {rest.length > 0 && (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-4 md:p-8">
              <div className="flex flex-col gap-3">
                {rest.map((user, i) => {
                  const rank = i + 4;
                  const isMe = user._id === currentUser?._id;
                  return (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isMe ? "border-[#0d7377] bg-[#e2f1ec]" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`}
                    >
                      {/* Rank number */}
                      <div className="w-10 h-10 flex items-center justify-center font-black text-lg rounded-full bg-gray-50 text-gray-400 border border-gray-200 shrink-0">
                        {rank}
                      </div>

                      <Avatar user={user} size="sm" rank={rank - 1} />

                      {/* Name + skills */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#1a2e2a] flex items-center gap-2 text-sm">
                          {user.name}
                          {isMe && <span className="text-[10px] font-bold bg-[#0d7377] text-white px-2 py-0.5 rounded-full">YOU</span>}
                          {isOnline(user.lastSeen) && <span className="w-2 h-2 rounded-full bg-green-400" />}
                        </h3>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {user.skills?.slice(0, 2).map((s, j) => (
                            <span key={j} className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{s}</span>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 shrink-0">
                        <div className="text-center hidden sm:block">
                          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Solved</span>
                          <span className="font-extrabold text-base flex items-center gap-1 justify-center">
                            <Award size={13} className="text-[#14b8a6]" /> {user.contributions}
                          </span>
                        </div>
                        <div className="text-center hidden sm:block">
                          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trust</span>
                          <span className="font-extrabold text-base flex items-center gap-1 justify-center">
                            <TrendingUp size={13} className="text-[#115e59]" /> {user.trustScore}%
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Score</span>
                          <span className="font-extrabold text-base text-[#0d7377]">{user.score}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeaderboardPage;
