import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";

const LandingPage = ({ isAuthenticated }) => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/requests?status=Open");
        if (data.success) {
          setFeatured(data.data.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-16 py-8">
      
      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Column */}
        <div className="w-full md:w-[60%] flex flex-col gap-6">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#115e59] uppercase mb-4 block">SMIT GRAND CODING NIGHT 2026</span>
            <h1 className="text-[52px] font-extrabold text-[#1a2e2a] leading-[1.05] tracking-tight mb-6">
              Find help faster.<br/>Become help that<br/>matters.
            </h1>
            <p className="text-gray-500 text-[17px] leading-relaxed max-w-lg mb-8">
              HelpHub AI is a community-powered support network for students, mentors, creators, and builders. Ask for help, offer help, track impact, and let AI surface smarter matches across the platform.
            </p>
            <div className="flex flex-wrap gap-4 mb-4">
              <Link to="/auth" className="bg-[#115e59] hover:bg-[#0f514e] text-white px-6 py-3.5 rounded-full font-bold shadow-sm transition-colors text-sm">
                Open product demo
              </Link>
              <Link to="/auth" className="bg-white border border-gray-200 text-[#1a2e2a] hover:bg-gray-50 px-6 py-3.5 rounded-full font-bold transition-colors text-sm">
                Post a request
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-auto">
            <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm flex-1 min-w-[120px]">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">MEMBERS</div>
              <div className="text-3xl font-extrabold text-[#1a2e2a] mb-2">384+</div>
              <p className="text-gray-500 text-xs">Students, mentors, and helpers in the loop.</p>
            </div>
            <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm flex-1 min-w-[120px]">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">REQUESTS</div>
              <div className="text-3xl font-extrabold text-[#1a2e2a] mb-2">72+</div>
              <p className="text-gray-500 text-xs">Support posts shared across learning journeys.</p>
            </div>
            <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm flex-1 min-w-[120px]">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">SOLVED</div>
              <div className="text-3xl font-extrabold text-[#1a2e2a] mb-2">69+</div>
              <p className="text-gray-500 text-xs">Problems resolved through fast community action.</p>
            </div>
          </div>
        </div>

        {/* Right Column (Dark Pill Card) */}
        <div className="w-full md:w-[40%] bg-[#1a2e2a] text-white p-10 py-12 rounded-[2.5rem] shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-8 right-8 w-16 h-16 bg-[#f0c040] rounded-full filter blur-sm"></div>
          
          <div className="relative z-10 mb-8">
            <span className="text-xs font-bold tracking-widest text-[#f0c040] uppercase mb-4 block">LIVE PRODUCT FEEL</span>
            <h2 className="text-[36px] font-extrabold mb-4 leading-tight">
              More than a form.<br/>More like an<br/>ecosystem.
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              A polished multi-page experience inspired by product platforms, with AI summaries, trust scores, contribution signals, notifications, and leaderboard momentum built directly in HTML, CSS, JavaScript, and LocalStorage.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-3">
            <div className="bg-[#e2f1ec] text-[#1a2e2a] p-4 rounded-2xl">
              <h4 className="font-bold text-[15px] mb-1">AI request intelligence</h4>
              <p className="text-[13px] text-gray-600">Auto-categorization, urgency detection, tags, rewrite suggestions, and trend snapshots.</p>
            </div>
            <div className="bg-[#e2f1ec] text-[#1a2e2a] p-4 rounded-2xl">
              <h4 className="font-bold text-[15px] mb-1">Community trust graph</h4>
              <p className="text-[13px] text-gray-600">Badges, helper rankings, trust score boosts, and visible contribution history.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Core Flow */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#115e59] uppercase mb-2 block">CORE FLOW</span>
            <h2 className="text-[32px] font-extrabold text-[#1a2e2a]">From struggling alone to solving together</h2>
          </div>
          <Link to="/auth" className="bg-white border border-gray-200 text-[#1a2e2a] px-5 py-2.5 rounded-full text-sm font-bold shadow-sm hover:bg-gray-50">
            Try onboarding AI
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg text-[#1a2e2a] mb-2">Ask for help clearly</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Create structured requests with category, urgency. AI suggestions, and tags that attract the right people.</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg text-[#1a2e2a] mb-2">Discover the right people</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Use the explore feed, helper lists, notifications, and messaging to move quickly once a match happens.</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg text-[#1a2e2a] mb-2">Track real contribution</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Trust scores, badges, solved requests, and rankings help the community recognize meaningful support.</p>
          </div>
        </div>
      </div>

      {/* Featured Requests */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#115e59] uppercase mb-2 block">FEATURED REQUESTS</span>
            <h2 className="text-[32px] font-extrabold text-[#1a2e2a]">Community problems currently in motion</h2>
          </div>
          <Link to="/explore" className="bg-white border border-gray-200 text-[#1a2e2a] px-5 py-2.5 rounded-full text-sm font-bold shadow-sm hover:bg-gray-50">
            View full feed
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((req, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-2 mb-4">
                  <span className="bg-[#e2f1ec] text-[#115e59] px-2.5 py-1 rounded-md text-[11px] font-bold uppercase">{req.category}</span>
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase ${req.urgency === 'High' || req.urgency === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-[#e2f1ec] text-[#115e59]'}`}>{req.urgency}</span>
                  <span className="bg-[#e2f1ec] text-[#115e59] px-2.5 py-1 rounded-md text-[11px] font-bold uppercase">{req.status}</span>
                </div>
                <h3 className="font-bold text-base text-[#1a2e2a] mb-2 leading-tight">{req.title}</h3>
                <p className="text-gray-500 text-[13px] leading-relaxed mb-4 line-clamp-3">{req.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {req.tags?.map((tag, j) => (
                    <span key={j} className="text-[10px] font-bold text-[#115e59] bg-[#e2f1ec] px-2 py-1 rounded uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <div>
                  <div className="text-[13px] font-bold text-[#1a2e2a]">{req.createdBy?.name}</div>
                  <div className="text-[11px] text-gray-500">{req.createdBy?.location || 'Karachi'} • 1 helper interested</div>
                </div>
                <Link to={`/request/${req._id}`} className="bg-gray-50 text-[#1a2e2a] px-4 py-2 rounded-full text-[12px] font-bold border border-gray-100 hover:bg-gray-100">
                  Open details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default LandingPage;
