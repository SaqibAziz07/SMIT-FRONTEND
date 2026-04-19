import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const OnboardingPage = ({ user, login }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    skills: user?.skills?.join(", ") || "",
    interests: user?.interests?.join(", ") || "",
    location: user?.location || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
      interests: formData.interests.split(",").map((i) => i.trim()).filter(Boolean),
      location: formData.location,
    };

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        "http://localhost:5000/api/users/profile",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        const updatedUser = { ...user, ...payload };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        login(updatedUser, token);
        navigate("/dashboard");
      } else {
        setError("Failed to update profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while updating your profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100"
      >
        <h2 className="text-3xl font-extrabold text-[#1a2e2a] mb-2">Update your identity</h2>
        <p className="text-gray-500 mb-8">Tell us what you're good at, and what you want to learn.</p>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              disabled
              value={user?.name || ""}
              className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
            <input 
              type="text" 
              required
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#115e59] focus:outline-none transition-colors"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="e.g. Karachi, Pakistan"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Skills (comma separated)</label>
            <input 
              type="text" 
              required
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#115e59] focus:outline-none transition-colors"
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
              placeholder="Figma, UI/UX, React, Node.js"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Interests (What you want to learn)</label>
            <input 
              type="text" 
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#115e59] focus:outline-none transition-colors"
              value={formData.interests}
              onChange={(e) => setFormData({...formData, interests: e.target.value})}
              placeholder="Machine Learning, AWS, System Design"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#115e59] hover:bg-[#0f514e] text-white font-bold py-3.5 rounded-xl transition-colors mt-4"
          >
            {loading ? "Saving..." : "Save profile & Continue"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;