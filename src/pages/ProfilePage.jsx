import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Save, LogOut, User as UserIcon, MapPin, Tag, Sparkles } from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";

const ProfilePage = ({ user, login, logout }) => {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [formData, setFormData] = useState({
    name:      user?.name      || "",
    bio:       user?.bio       || "",
    location:  user?.location  || "",
    skills:    user?.skills?.join(", ")    || "",
    interests: user?.interests?.join(", ") || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [avatarFile,    setAvatarFile]    = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [success,    setSuccess]    = useState("");
  const [error,      setError]      = useState("");

  // ── Avatar pick ─────────────────────────────────────────────────────────────
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // ── Upload avatar to Cloudinary via backend ──────────────────────────────────
  const uploadAvatarToCloud = async (token) => {
    if (!avatarFile) return null;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("avatar", avatarFile);
      const { data } = await axios.post(`${API_ENDPOINTS.USERS}/avatar`, fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      return data.success ? data.avatarUrl : null;
    } catch {
      return null;
    } finally {
      setUploading(false);
    }
  };

  // ── Save profile ─────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setLoading(true); setError(""); setSuccess("");
    try {
      const token = localStorage.getItem("token");

      // 1. Upload avatar if changed
      const newAvatarUrl = await uploadAvatarToCloud(token);

      // 2. Update text fields
      const { data } = await axios.put(
        `${API_ENDPOINTS.USERS}/profile`,
        {
          name:      formData.name.trim(),
          bio:       formData.bio,
          location:  formData.location,
          skills:    formData.skills.split(",").map(s => s.trim()).filter(Boolean),
          interests: formData.interests.split(",").map(i => i.trim()).filter(Boolean),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        const updatedUser = {
          ...user,
          ...data.data,
          avatar: newAvatarUrl || data.data.avatar || user.avatar,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        login(updatedUser, token);
        setSuccess("Profile saved successfully!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  // ── Avatar display component ─────────────────────────────────────────────────
  const AvatarSection = () => (
    <div className="flex flex-col items-center gap-4 mb-8">
      <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
        {avatarPreview ? (
          <img src={avatarPreview} alt="Avatar" className="w-28 h-28 rounded-full object-cover ring-4 ring-[#0d7377]/20 shadow-lg" />
        ) : (
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#129F8A] to-[#0d7377] flex items-center justify-center text-4xl font-black text-white ring-4 ring-[#0d7377]/20 shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera size={24} className="text-white" />
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
      <button onClick={() => fileRef.current?.click()} className="text-xs text-[#0d7377] font-semibold hover:underline">
        {uploading ? "Uploading..." : "Change photo"}
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">

      {/* ── Dark header ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a2e2a] text-white p-10 md:p-14 rounded-[2.5rem] shadow-sm relative overflow-hidden flex items-center gap-8"
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#f0c040] rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="relative z-10 flex items-center gap-6">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#129F8A] to-[#14b8a6] flex items-center justify-center text-3xl font-black text-white ring-4 ring-white/20 shadow-xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <span className="text-xs font-bold tracking-widest text-[#f0c040] uppercase block mb-1">Profile</span>
            <h1 className="text-4xl font-extrabold leading-tight">{user?.name}</h1>
            <p className="text-gray-400 text-sm mt-1">{user?.role} • {formData.location || "Location not set"}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        {/* ── Public stats card ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-[#f9f9f7] p-10 rounded-[2.5rem] border border-gray-100 shadow-sm"
        >
          <span className="text-xs font-bold tracking-[0.2em] text-[#115e59] uppercase mb-4 block">Public Profile</span>
          <h2 className="text-[28px] font-extrabold text-[#1a2e2a] mb-6">Skills & Reputation</h2>

          <div className="flex flex-col gap-1 mb-8">
            {[
              ["Trust Score",    `${user?.trustScore ?? 0}%`],
              ["Contributions",  user?.contributions ?? 0],
              ["Badges Earned",  user?.badges?.length ?? 0],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between items-center py-3.5 border-b border-gray-200">
                <span className="text-gray-600 font-medium text-[15px]">{label}</span>
                <span className="font-extrabold text-[#1a2e2a] text-lg">{val}</span>
              </div>
            ))}
          </div>

          {user?.bio && (
            <div className="mb-6">
              <h3 className="font-bold text-[#1a2e2a] mb-2 text-sm uppercase tracking-widest text-gray-400">Bio</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{user.bio}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-bold text-[#1a2e2a] mb-3 text-[15px]">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user?.skills?.length > 0
                ? user.skills.map((s, i) => (
                    <span key={i} className="bg-[#e2f1ec] text-[#115e59] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{s}</span>
                  ))
                : <span className="text-gray-400 text-sm italic">Add skills below…</span>}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[#1a2e2a] mb-3 text-[15px]">Badges</h3>
            <div className="flex flex-wrap gap-2">
              {user?.badges?.length > 0
                ? user.badges.map((b, i) => (
                    <span key={i} className="bg-[#e2f1ec] text-[#115e59] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">🏅 {b}</span>
                  ))
                : <span className="text-gray-400 text-sm italic">No badges yet.</span>}
            </div>
          </div>
        </motion.div>

        {/* ── Edit card ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm"
        >
          <span className="text-xs font-bold tracking-[0.2em] text-[#115e59] uppercase mb-4 block">Edit Profile</span>
          <h2 className="text-[28px] font-extrabold text-[#1a2e2a] mb-6">Update your identity</h2>

          <AvatarSection />

          {error   && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-4">{error}</div>}
          {success && <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium mb-4">✓ {success}</div>}

          <div className="flex flex-col gap-5">
            {/* Name */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
                <UserIcon size={12} /> Name
              </label>
              <input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 font-medium outline-none focus:border-[#115e59] transition-colors"
                placeholder="Full name"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
                <Sparkles size={12} /> Bio
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 font-medium outline-none focus:border-[#115e59] transition-colors resize-none"
                placeholder="A short bio about yourself…"
              />
            </div>

            {/* Location */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
                <MapPin size={12} /> Location
              </label>
              <input
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 font-medium outline-none focus:border-[#115e59] transition-colors"
                placeholder="e.g. Karachi"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
                <Tag size={12} /> Skills <span className="normal-case font-normal">(comma-separated)</span>
              </label>
              <input
                value={formData.skills}
                onChange={e => setFormData({ ...formData, skills: e.target.value })}
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 font-medium outline-none focus:border-[#115e59] transition-colors"
                placeholder="Figma, React, Python, Career Guidance"
              />
            </div>

            {/* Interests */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
                <Sparkles size={12} /> Interests <span className="normal-case font-normal">(comma-separated)</span>
              </label>
              <input
                value={formData.interests}
                onChange={e => setFormData({ ...formData, interests: e.target.value })}
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 font-medium outline-none focus:border-[#115e59] transition-colors"
                placeholder="Hackathons, UI/UX, Community Building"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={loading || uploading}
              className="w-full bg-[#14b8a6] hover:bg-[#0d9488] disabled:opacity-50 text-white font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2 text-[15px] shadow-lg shadow-[#14b8a6]/20"
            >
              <Save size={18} />
              {loading ? "Saving…" : uploading ? "Uploading photo…" : "Save Profile"}
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-red-500 font-bold py-4 rounded-xl border border-red-100 hover:bg-red-50 transition-all flex items-center justify-center gap-2 text-[15px]"
            >
              <LogOut size={18} /> Logout from platform
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;