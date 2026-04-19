import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const ProfilePage = ({ user, login, logout }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: user?.location || "",
    skills: user?.skills?.join(", ") || "",
    interests: user?.interests?.join(", ") || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        "http://localhost:5000/api/users/profile",
        {
          location: formData.location,
          skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
          interests: formData.interests.split(",").map((i) => i.trim()).filter(Boolean),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        const updatedUser = { ...user, ...data.data };
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a2e2a] text-white p-12 md:p-16 rounded-[2.5rem] shadow-sm relative overflow-hidden"
      >
        <div className="relative z-10">
          <span className="text-xs font-bold tracking-widest text-[#f0c040] uppercase mb-4 block">PROFILE</span>
          <h1 className="text-[48px] font-extrabold mb-2 leading-[1.05] tracking-tight">{user?.name}</h1>
          <p className="text-gray-400 font-medium">{user?.role} • {user?.location || "Location not set"}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Public Profile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-[#f9f9f7] p-10 rounded-[2.5rem] border border-gray-100 shadow-sm"
        >
          <span className="text-xs font-bold tracking-[0.2em] text-[#115e59] uppercase mb-4 block">PUBLIC PROFILE</span>
          <h2 className="text-[32px] font-extrabold text-[#1a2e2a] mb-8">Skills and reputation</h2>

          <div className="flex flex-col gap-1 mb-10">
            <div className="flex justify-between items-center py-4 border-b border-gray-200">
              <span className="text-gray-600 font-medium text-[15px]">Trust score</span>
              <span className="font-extrabold text-[#1a2e2a] text-lg">{user?.trustScore ?? 0}%</span>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-gray-200">
              <span className="text-gray-600 font-medium text-[15px]">Contributions</span>
              <span className="font-extrabold text-[#1a2e2a] text-lg">{user?.contributions ?? 0}</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-[#1a2e2a] mb-4 text-[17px]">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user?.skills?.length > 0
                ? user.skills.map((s, i) => (
                    <span key={i} className="bg-[#e2f1ec] text-[#115e59] px-3.5 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wide">
                      {s}
                    </span>
                  ))
                : <span className="text-gray-400 text-sm italic">Add skills below...</span>}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[#1a2e2a] mb-4 text-[17px]">Badges</h3>
            <div className="flex flex-wrap gap-2">
              {user?.badges?.length > 0
                ? user.badges.map((b, i) => (
                    <span key={i} className="bg-[#e2f1ec] text-[#115e59] px-3.5 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wide">
                      {b}
                    </span>
                  ))
                : <span className="text-gray-400 text-[13px] font-medium italic">No badges earned yet.</span>}
            </div>
          </div>
        </motion.div>

        {/* Edit Profile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm"
        >
          <span className="text-xs font-bold tracking-[0.2em] text-[#115e59] uppercase mb-4 block">EDIT PROFILE</span>
          <h2 className="text-[32px] font-extrabold text-[#1a2e2a] mb-8">Update your identity</h2>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-5">{error}</div>}
          {success && <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium mb-5">{success}</div>}

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Name</label>
                <input value={user?.name || ""} readOnly className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3.5 text-[#1a2e2a] font-medium outline-none cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Location</label>
                <input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 text-[#1a2e2a] font-medium outline-none focus:border-[#115e59] transition-colors"
                  placeholder="e.g. Karachi"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Skills</label>
              <input
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 text-[#1a2e2a] font-medium outline-none focus:border-[#115e59] transition-colors"
                placeholder="Figma, UI/UX, HTML/CSS, Career Guidance"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Interests</label>
              <input
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 text-[#1a2e2a] font-medium outline-none focus:border-[#115e59] transition-colors"
                placeholder="Hackathons, UI/UX, Community Building"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-[#14b8a6] hover:bg-[#0d9488] text-white font-bold py-4 rounded-full transition-all mt-2 text-[15px] disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save profile"}
            </button>
            <button
              onClick={handleLogout}
              className="text-red-500 font-bold py-4 rounded-xl border border-red-100 hover:bg-red-50 transition-all -mt-2.5 text-[15px]"
            >
              Logout from platform
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;