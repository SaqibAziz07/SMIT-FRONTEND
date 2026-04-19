import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BrainCircuit, Sparkles } from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";

const CreateRequestPage = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", description: "", category: "General", urgency: "Medium", tags: [] });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  const handleAISuggest = async () => {
    if (!formData.title || !formData.description) {
      setAiMessage("❌ Please fill in title and description first");
      setTimeout(() => setAiMessage(""), 3000);
      return;
    }
    
    setAiLoading(true);
    setAiMessage("");
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(`${API_ENDPOINTS.AI}/suggest`, 
        { title: formData.title, description: formData.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data.success && data.data) {
        setFormData(prev => ({
          ...prev,
          category: data.data.category || prev.category,
          urgency: data.data.urgency || prev.urgency,
          tags: data.data.tags || prev.tags
        }));
        setAiMessage("✅ AI suggestions applied!");
        setTimeout(() => setAiMessage(""), 3000);
      }
    } catch (err) {
      console.error("AI Error:", err.response?.data?.message || err.message);
      setAiMessage("⚠️ Using default suggestions (API unavailable)");
      // Apply basic defaults
      setFormData(prev => ({
        ...prev,
        category: "General",
        urgency: "Medium",
        tags: ["help", "support"]
      }));
      setTimeout(() => setAiMessage(""), 3000);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(API_ENDPOINTS.REQUESTS, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/explore");
    } catch (err) {
      console.error(err);
      alert("Error posting request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold text-[#1a2e2a] mb-2">Ask for help clearly</h1>
        <p className="text-gray-500 mb-8">Create a structured request. Use AI to auto-categorize and suggest tags to attract the right people.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-bold text-[#1a2e2a] mb-2">Title</label>
            <input 
              required type="text"
              className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-5 py-4 focus:border-[#14b8a6] focus:bg-white focus:outline-none transition-all text-[#1a2e2a] font-medium"
              placeholder="e.g. Need help making my portfolio responsive before demo day"
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1a2e2a] mb-2">Description</label>
            <textarea 
              required rows={5}
              className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-5 py-4 focus:border-[#14b8a6] focus:bg-white focus:outline-none transition-all text-[#1a2e2a]"
              placeholder="Explain what you are struggling with..."
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="bg-[#1a2e2a] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-white font-bold flex items-center gap-2"><BrainCircuit size={18} className="text-[#14b8a6]"/> AI Processing</h4>
              <p className="text-gray-400 text-sm mt-1">Let Helplytics AI analyze your request and apply the best tags, category, and urgency.</p>
              {aiMessage && (
                <p className="text-sm mt-2 font-medium">{aiMessage}</p>
              )}
            </div>
            <button type="button" onClick={handleAISuggest} disabled={aiLoading} className="shrink-0 bg-[#14b8a6] hover:bg-[#0d9488] text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-md disabled:opacity-50">
              {aiLoading ? "Analyzing..." : <><Sparkles size={16}/> Auto-fill</>}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
              <input 
                type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:border-[#14b8a6] focus:outline-none"
                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Urgency</label>
              <select 
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:border-[#14b8a6] focus:outline-none appearance-none bg-white"
                value={formData.urgency} onChange={e => setFormData({...formData, urgency: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tags</label>
              <input 
                type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:border-[#14b8a6] focus:outline-none"
                value={formData.tags.join(", ")} onChange={e => setFormData({...formData, tags: e.target.value.split(",").map(t=>t.trim()).filter(t => t !== "")})}
                placeholder="React, Frontend, CSS"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#1a2e2a] hover:bg-[#115e59] text-white font-bold py-4 rounded-xl transition-colors mt-2 text-lg shadow-md">
            {loading ? "Posting..." : "Post Request to Community"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateRequestPage;
