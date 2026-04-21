import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { useRef } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";

const AuthPage = ({ login }) => {
  const navigate  = useNavigate();
  const fileRef   = useRef(null);

  const [isLogin,   setIsLogin]   = useState(true);
  const [formData,  setFormData]  = useState({ name: "", email: "", password: "", role: "Both" });
  const [avatarFile,    setAvatarFile]    = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAvatarPick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    try {
      if (isLogin) {
        const response = await axios.post(`${API_ENDPOINTS.AUTH}/login`, {
          email: formData.email,
          password: formData.password,
        });
        login(response.data.user, response.data.token);
        navigate("/dashboard");
      } else {
        // 1. Register
        const response = await axios.post(`${API_ENDPOINTS.AUTH}/register`, formData);

        if (response.data.success && response.data.token) {
          const { token, user } = response.data;

          // 2. If avatar selected → upload it immediately
          if (avatarFile) {
            try {
              const fd = new FormData();
              fd.append("avatar", avatarFile);
              const avatarRes = await axios.post(`${API_ENDPOINTS.USERS}/avatar`, fd, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              });
              if (avatarRes.data.success) {
                user.avatar = avatarRes.data.avatarUrl;
              }
            } catch { /* Avatar upload failed — continue without it */ }
          }

          setSuccess("Account created! Redirecting…");
          setTimeout(() => {
            login(user, token);
            navigate("/dashboard");
          }, 700);
        } else {
          setSuccess(response.data.message);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 items-stretch justify-center h-full pt-10">

      {/* ── Left dark panel ── */}
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
            A multi-page platform for asking, offering, and tracking help — with AI, reputation scores, and real community signals.
          </p>
          <ul className="text-gray-300 flex flex-col gap-4 font-medium">
            {[
              "Real user profiles with secure authentication",
              "AI-powered request matching and insights",
              "Community reputation and contribution badges",
            ].map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f0c040] mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* ── Right form panel ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-1/2 bg-[#f9f9f7] p-12 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-center"
      >
        {/* Tab switcher */}
        <div className="flex gap-8 mb-8 border-b border-gray-200 pb-2">
          {[["Login", true], ["Sign Up", false]].map(([label, val]) => (
            <button
              key={label}
              onClick={() => { setIsLogin(val); setError(""); setSuccess(""); setAvatarPreview(null); setAvatarFile(null); }}
              className={`text-sm font-bold uppercase tracking-widest pb-2 transition-all ${isLogin === val ? "text-[#115e59] border-b-2 border-[#115e59]" : "text-gray-400"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <h2 className="text-[36px] font-extrabold text-[#1a2e2a] mb-6 leading-tight tracking-tight">
          {isLogin ? "Sign in to your profile" : "Create your account"}
        </h2>

        {error   && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-4">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm font-medium mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Avatar picker (signup only) */}
          {!isLogin && (
            <div className="flex flex-col items-center gap-3">
              <div
                className="relative w-20 h-20 cursor-pointer group"
                onClick={() => fileRef.current?.click()}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-20 h-20 rounded-full object-cover ring-4 ring-[#0d7377]/20" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#129F8A] to-[#0d7377] flex items-center justify-center text-white">
                    <Camera size={28} />
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera size={20} className="text-white" />
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />
              <span className="text-xs text-gray-400">{avatarPreview ? "Photo selected ✓" : "Add profile photo (optional)"}</span>
            </div>
          )}

          {/* Name */}
          {!isLogin && (
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Name</label>
              <input
                type="text" required
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 focus:border-[#115e59] focus:outline-none transition-colors font-medium"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Asad Khan"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Email</label>
            <input
              type="email" required
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 focus:border-[#115e59] focus:outline-none transition-colors font-medium"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Password</label>
            <input
              type="password" required
              className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 focus:border-[#115e59] focus:outline-none transition-colors font-medium"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          {/* Role */}
          {!isLogin && (
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Primary Role</label>
              <select
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 focus:border-[#115e59] focus:outline-none transition-colors appearance-none font-medium"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
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
            className="w-full bg-[#14b8a6] hover:bg-[#0d9488] disabled:opacity-60 text-white font-bold py-4 rounded-full transition-all mt-2 text-[15px] shadow-lg shadow-[#14b8a6]/20 flex justify-center items-center gap-3"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Please wait…</>
            ) : (
              isLogin ? "Continue to dashboard" : "Create profile"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AuthPage;
