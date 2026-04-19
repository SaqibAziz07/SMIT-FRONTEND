import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Zap, Users, ShieldAlert, ArrowRight } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api.js";

const AICenterPage = () => {
  const [insights, setInsights] = useState({ requests: [], highUrgency: 0, mentorCount: 2 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await axios.get(API_ENDPOINTS.REQUESTS);
        if (data.success) {
          const openReqs = data.data.filter(r => r.status === "Open");
          const highUrgency = openReqs.filter(r => r.urgency === "High" || r.urgency === "Critical").length;
          
          setInsights({ requests: openReqs, highUrgency, mentorCount: 2 });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      
      {/* Header Card */}
      <div className="bg-[#1a2e2a] rounded-[2.5rem] p-12 md:p-16 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10">
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4 block">AI CENTER</span>
          <h1 className="text-[48px] font-extrabold mb-4 leading-[1.05] tracking-tight max-w-2xl">
            See what the platform intelligence is noticing.
          </h1>
          <p className="text-lg text-gray-300 font-medium max-w-2xl">
            AI-like insights summarize demand trends, helper readiness, urgency signals, and request recommendations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm flex flex-col">
          <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">TREND PULSE</div>
          <h3 className="text-3xl font-extrabold text-[#1a2e2a] mb-3">Web Development</h3>
          <p className="text-gray-500 text-[14px] font-medium leading-relaxed">
            Most common support area based on active community requests.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm flex flex-col">
          <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">URGENCY WATCH</div>
          <h3 className="text-3xl font-extrabold text-[#1a2e2a] mb-3">{insights.highUrgency}</h3>
          <p className="text-gray-500 text-[14px] font-medium leading-relaxed">
            Requests currently flagged high priority by the urgency detector.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm flex flex-col">
          <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">MENTOR POOL</div>
          <h3 className="text-3xl font-extrabold text-[#1a2e2a] mb-3">{insights.mentorCount}</h3>
          <p className="text-gray-500 text-[14px] font-medium leading-relaxed">
            Trusted helpers with strong response history and contribution signals.
          </p>
        </motion.div>
      </div>

      <div className="bg-[#f9f9f7] rounded-[2.5rem] p-10 md:p-12 border border-gray-100 shadow-sm">
        <div className="text-[11px] font-black text-[#115e59] uppercase tracking-[0.2em] mb-2">AI RECOMMENDATIONS</div>
        <h2 className="text-[36px] font-extrabold text-[#1a2e2a] mb-10 tracking-tight">
          Requests needing attention
        </h2>
        
        {loading ? (
          <div className="text-gray-400 font-bold">Analyzing requests...</div>
        ) : (
          <div className="flex flex-col gap-5">
            {insights.requests.map((req, i) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={req._id} className="p-8 rounded-4xl border border-gray-100 bg-white flex flex-col gap-4 shadow-sm hover:shadow-md transition-all">
                <div>
                  <h3 className="font-extrabold text-[19px] text-[#1a2e2a] mb-2">{req.title}</h3>
                  <p className="text-[15px] text-gray-500 font-medium leading-relaxed max-w-3xl">
                    AI summary: {req.description.length > 150 ? req.description.substring(0, 150) + '...' : req.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="bg-[#e2f1ec] text-[#115e59] px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide">
                    {req.category}
                  </span>
                  <span className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${req.urgency === 'High' || req.urgency === 'Critical' ? 'bg-[#e2f1ec] text-[#115e59]' : 'bg-[#e2f1ec] text-[#115e59]'}`}>
                    {req.urgency}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AICenterPage;
