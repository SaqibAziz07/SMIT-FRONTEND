import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, TrendingUp, Bookmark, BookmarkCheck, X } from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";

const FeedPage = () => {
  const [requests,    setRequests]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [tab,         setTab]         = useState("feed"); // "feed" | "saved"
  const [bookmarks,   setBookmarks]   = useState([]);
  const [bookmarkIds, setBookmarkIds] = useState(new Set());
  const [togglingId,  setTogglingId]  = useState(null);

  const token      = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // ── Fetch requests ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await axios.get(API_ENDPOINTS.REQUESTS);
        if (data.success) setRequests(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // ── Fetch saved bookmarks (authenticated only) ────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchBookmarks = async () => {
      try {
        const { data } = await axios.get(`${API_ENDPOINTS.USERS}/bookmarks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) {
          setBookmarks(data.data);
          setBookmarkIds(new Set(data.data.map(b => b._id)));
        }
      } catch (err) { console.error(err); }
    };
    fetchBookmarks();
  }, [isLoggedIn]);

  // ── Toggle bookmark ───────────────────────────────────────────────────────
  const handleBookmark = async (e, reqId) => {
    e.preventDefault();
    if (!isLoggedIn) return;
    setTogglingId(reqId);
    try {
      const { data } = await axios.post(
        `${API_ENDPOINTS.USERS}/bookmark/${reqId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        const next = new Set(bookmarkIds);
        if (data.bookmarked) {
          next.add(reqId);
          const req = requests.find(r => r._id === reqId);
          if (req) setBookmarks(prev => [req, ...prev]);
        } else {
          next.delete(reqId);
          setBookmarks(prev => prev.filter(b => b._id !== reqId));
        }
        setBookmarkIds(next);
      }
    } catch (err) { console.error(err); }
    finally { setTogglingId(null); }
  };

  // ── Filter + search ───────────────────────────────────────────────────────
  const baseList = tab === "saved" ? bookmarks : requests;
  const displayed = baseList.filter(r => {
    const matchStatus = filter === "All" || r.status === filter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      r.title?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q) ||
      r.tags?.some(t => t.toLowerCase().includes(q)) ||
      r.category?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  // ── Card component ────────────────────────────────────────────────────────
  const RequestCard = ({ req, i }) => {
    const saved = bookmarkIds.has(req._id);
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.04 }}
        key={req._id}
        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group relative"
      >
        {/* Bookmark button */}
        {isLoggedIn && (
          <button
            onClick={(e) => handleBookmark(e, req._id)}
            disabled={togglingId === req._id}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-300 hover:text-[#0d7377] transition-colors"
            title={saved ? "Remove bookmark" : "Save"}
          >
            {saved ? <BookmarkCheck size={18} className="text-[#0d7377]" /> : <Bookmark size={18} />}
          </button>
        )}

        <div>
          <div className="flex items-center gap-2 flex-wrap mb-4 pr-8">
            <span className="bg-[#115e59]/10 text-[#115e59] px-2.5 py-1 rounded-md text-xs font-bold">{req.category}</span>
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
              req.status === "Solved" ? "bg-gray-100 text-gray-500"
              : req.urgency === "High" || req.urgency === "Critical" ? "bg-red-50 text-red-600"
              : "bg-yellow-50 text-yellow-600"
            }`}>
              {req.status === "Solved" ? "Solved" : `${req.urgency} Urgency`}
            </span>
          </div>

          <h3 className="font-bold text-xl text-[#1a2e2a] mb-2 line-clamp-2">{req.title}</h3>
          <p className="text-gray-500 text-sm line-clamp-3 mb-4">{req.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {req.tags?.slice(0, 3).map((tag, j) => (
              <span key={j} className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            {req.createdBy?.avatar ? (
              <img src={req.createdBy.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#129F8A] to-[#0d7377] flex items-center justify-center text-white text-xs font-bold">
                {req.createdBy?.name?.charAt(0) || "?"}
              </div>
            )}
            <div>
              <span className="block text-xs text-gray-400 font-bold tracking-wider">POSTED BY</span>
              <span className="text-sm font-semibold text-[#1a2e2a]">{req.createdBy?.name || "Anonymous"}</span>
            </div>
          </div>
          <Link to={`/request/${req._id}`} className="bg-[#1a2e2a] hover:bg-[#115e59] text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
            Open
          </Link>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">

      {/* ── Top bar ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1a2e2a]">Community Feed</h1>
          <p className="text-gray-500 mt-1 text-sm">Discover problems in motion and find where you can help.</p>
        </div>
        <Link
          to="/leaderboard"
          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm"
        >
          <TrendingUp size={16} /> Leaderboard
        </Link>
      </div>

      {/* ── Search + Filter bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title, tag, or category…"
            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0d7377] focus:ring-2 focus:ring-[#0d7377]/10 transition-all bg-white shadow-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm shrink-0">
          {["All", "Open", "Solved"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === f ? "bg-[#1a2e2a] text-white shadow-sm" : "text-gray-500 hover:text-[#1a2e2a]"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tabs: Feed | Saved ── */}
      {isLoggedIn && (
        <div className="flex gap-1 border-b border-gray-200">
          {[
            { key: "feed",  label: "All Requests" },
            { key: "saved", label: `Saved (${bookmarks.length})` },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-all ${tab === t.key ? "border-[#0d7377] text-[#0d7377]" : "border-transparent text-gray-400 hover:text-gray-700"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-10 h-10 border-4 border-[#14b8a6]/30 border-t-[#14b8a6] rounded-full animate-spin" />
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-3xl border border-gray-100">
          {searchQuery ? `No results for "${searchQuery}"` : tab === "saved" ? "No saved requests yet." : "No requests found."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map((req, i) => <RequestCard key={req._id} req={req} i={i} />)}
        </div>
      )}
    </div>
  );
};

export default FeedPage;
