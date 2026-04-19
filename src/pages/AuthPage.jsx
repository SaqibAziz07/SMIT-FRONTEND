import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";

const AuthPage = ({ login }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "Both" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        const response = await axios.post(`${API_ENDPOINTS.AUTH}/login`, { 
          email: formData.email, 
          password: formData.password 
        });
        login(response.data.user, response.data.token);
      } else {
        const response = await axios.post(`${API_ENDPOINTS.AUTH}/register`, formData);
        setSuccess(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 items-stretch justify-center h-full pt-10">
      
      <motion.div 
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-1/2 bg-[#1a2e2a] text-white p-12 rounded-[2.5rem] shadow-sm flex flex-col justify-center relative overflow-hidden"
      >
        <div className="relative z-10">
          <span className="text-xs font-bold tracking-widest text-[#f0c040] uppercase mb-4 block">Platform Access</span>
          <h1 className="text-[48px] font-extrabold mb-6 leading-[1.05] tracking-tight">
            {isLogin ? "Welcome back to the loop." : "Join the support network."}
          </h1>
          <p className="text-gray-300 mb-8 leading-relaxed font-medium">
            Join a multi-page product flow designed for asking, offering, and tracking help with a premium interface.
          </p>
          <ul className="text-gray-300 flex flex-col gap-4 font-medium">
            <li className="flex gap-3 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f0c040] mt-2 shrink-0"></span>
              Real user profiles with secure authentication
            </li>
            <li className="flex gap-3 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f0c040] mt-2 shrink-0"></span>
              AI-powered request matching and insights
            </li>
            <li className="flex gap-3 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f0c040] mt-2 shrink-0"></span>
              Community reputation and contribution badges
            </li>
          </ul>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-1/2 bg-[#f9f9f7] p-12 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-center"
      >
        <div className="flex gap-8 mb-8 border-b border-gray-200 pb-2">
          <button 
            onClick={() => setIsLogin(true)}
            className={`text-sm font-bold uppercase tracking-widest pb-2 transition-all ${isLogin ? "text-[#115e59] border-b-2 border-[#115e59]" : "text-gray-400"}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`text-sm font-bold uppercase tracking-widest pb-2 transition-all ${!isLogin ? "text-[#115e59] border-b-2 border-[#115e59]" : "text-gray-400"}`}
          >
            Sign Up
          </button>
        </div>

        <h2 className="text-[36px] font-extrabold text-[#1a2e2a] mb-8 leading-tight tracking-tight">
          {isLogin ? "Sign in to your profile" : "Create your account"}
        </h2>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 animate-shake">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm font-medium mb-6">{success}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {!isLogin && (
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Name</label>
              <input 
                type="text" required
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 focus:border-[#115e59] focus:outline-none transition-colors font-medium"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Asad khan"
              />
            </div>
          )}

          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Email</label>
            <input 
              type="email" required
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 focus:border-[#115e59] focus:outline-none transition-colors font-medium"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Password</label>
            <input 
              type="password" required
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 focus:border-[#115e59] focus:outline-none transition-colors font-medium"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Primary Role</label>
              <select 
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 focus:border-[#115e59] focus:outline-none transition-colors appearance-none font-medium"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="Both">I can do both</option>
                <option value="Need Help">I need help with projects</option>
                <option value="Can Help">I want to mentor others</option>
              </select>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#14b8a6] hover:bg-[#0d9488] text-white font-bold py-4 rounded-full transition-all mt-4 text-[15px] shadow-lg shadow-[#14b8a6]/20 flex justify-center items-center gap-3"
          >
            {loading ? "Please wait..." : (isLogin ? "Continue to dashboard" : "Create profile")}
          </button>
        </form>
      </motion.div>

    </div>
  );
};

export default AuthPage;
