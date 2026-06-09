import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, FileText } from "lucide-react";
import { authService } from "../services/authService";
import AuthPanel from "./AuthPanel";

const Login = ({ onLogin, onGoSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    
    setLoading(true);
    setError("");
    
    const result = await authService.login(email, password);
    
    if (result.success) {
      onLogin(result.user);
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
        className="flex-1 flex items-center justify-center px-10 lg:px-12 py-10 bg-[#f4f4f0]"
      >
        <div className="w-full max-w-[400px]">
          <div className="mb-9">
            <h1 className="font-black text-2xl text-[#1a2e2a] mb-2">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm">
              Sign in to your Clause account
            </p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-500 px-3.5 py-2.5 rounded-lg text-xs mb-4 text-center">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="mb-4.5">
            <label className="block text-xs font-semibold text-[#1a2e2a] mb-1.5">
              Email address
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
                placeholder="Enter your password"
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

          <div className="flex justify-end mb-5.5">
            <span className="text-xs text-[#4caf82] font-semibold cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3.25 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
              loading 
                ? "bg-gray-500 text-white cursor-not-allowed" 
                : "bg-[#1a2e2a] text-white cursor-pointer hover:shadow-lg"
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner-animation" />
                Signing in…
              </>
            ) : (
              <> Sign In <ArrowRight size={16} /> </>
            )}
          </button>

          <p className="text-center mt-6 text-xs text-gray-500">
            Don't have an account?{" "}
            <span 
              onClick={onGoSignup} 
              className="text-[#4caf82] font-bold cursor-pointer hover:underline"
            >
              Sign up free
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;