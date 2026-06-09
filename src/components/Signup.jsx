import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { authService } from "../services/authService";
import AuthPanel from "./AuthPanel";

const Signup = ({ onSignup, onGoLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ["#e5e7eb", "#ef4444", "#f59e0b", "#4caf82"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  const handleSubmit = async () => {
    if (!agreed) {
      setError("Please agree to the Terms and Privacy Policy");
      return;
    }
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    setError("");
    
    const result = await authService.register(name, email, password);
    
    if (result.success) {
      onSignup(result.user);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen font-[family:'DM_Sans',sans-serif]">
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinner-animation {
          animation: spin 0.8s linear infinite;
        }
      `}</style>
      <AuthPanel />

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center px-10 lg:px-12 py-10 bg-[#f4f4f0] overflow-y-auto"
      >
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h1 className="font-black text-2xl text-[#1a2e2a] mb-2">
              Create your account
            </h1>
            <p className="text-gray-500 text-sm">
              Start your 14-day free trial — no card required
            </p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-500 px-3.5 py-2.5 rounded-lg text-xs mb-4 text-center">
              {error}
            </div>
          )}

          {/* Name Input */}
          <div className="mb-4.5">
            <label className="block text-xs font-semibold text-[#1a2e2a] mb-1.5">
              Full name
            </label>
            <div className="flex items-center border-[1.5px] border-gray-200 rounded-xl bg-white">
              <div className="px-3 text-gray-500">
                <User size={16} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Cooper"
                className="flex-1 border-none outline-none px-0 py-3 text-sm text-[#1a2e2a] bg-transparent"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-4.5">
            <label className="block text-xs font-semibold text-[#1a2e2a] mb-1.5">
              Work email
            </label>
            <div className="flex items-center border-[1.5px] border-gray-200 rounded-xl bg-white">
              <div className="px-3 text-gray-500">
                <Mail size={16} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 border-none outline-none px-0 py-3 text-sm text-[#1a2e2a] bg-transparent"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-4.5">
            <label className="block text-xs font-semibold text-[#1a2e2a] mb-1.5">
              Password
            </label>
            <div className="flex items-center border-[1.5px] border-gray-200 rounded-xl bg-white">
              <div className="px-3 text-gray-500">
                <Lock size={16} />
              </div>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="flex-1 border-none outline-none px-0 py-3 text-sm text-[#1a2e2a] bg-transparent"
              />
              <button 
                onClick={() => setShowPw(!showPw)} 
                className="bg-none border-none cursor-pointer px-3"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Password Strength */}
          {password.length > 0 && (
            <div className="-mt-2.5 mb-4">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="flex-1 h-0.5 rounded-sm"
                    style={{
                      background: i <= strength ? strengthColors[strength] : "#e5e7eb",
                    }} 
                  />
                ))}
              </div>
              <div className="text-[11px] font-semibold" style={{ color: strengthColors[strength] }}>
                {strengthLabels[strength]}
              </div>
            </div>
          )}

          {/* Terms Agreement */}
          <label className="flex items-start gap-2.5 mb-6 cursor-pointer">
            <input 
              type="checkbox" 
              checked={agreed} 
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 accent-[#4caf82] w-3.5 h-3.5"
            />
            <span className="text-xs text-gray-500 leading-relaxed">
              I agree to Clause's{" "}
              <span className="text-[#4caf82] font-semibold">Terms of Service</span> and{" "}
              <span className="text-[#4caf82] font-semibold">Privacy Policy</span>
            </span>
          </label>

          <button
            onClick={handleSubmit}
            disabled={loading || !agreed}
            className={`w-full py-3.25 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
              agreed && !loading 
                ? "bg-[#1a2e2a] text-white cursor-pointer hover:shadow-lg" 
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner-animation" />
                Creating account…
              </>
            ) : (
              <> Create Account <ArrowRight size={16} /> </>
            )}
          </button>

          <p className="text-center mt-6 text-xs text-gray-500">
            Already have an account?{" "}
            <span 
              onClick={onGoLogin} 
              className="text-[#4caf82] font-bold cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;