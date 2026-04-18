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
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <AuthPanel />

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "40px 48px", background: "#f4f4f0",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontWeight: 800, fontSize: 28, color: "#1a2e2a", marginBottom: 8 }}>
              Welcome back
            </h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              Sign in to your Clause account
            </p>
          </div>

          {error && (
            <div style={{
              background: "#fee2e2", color: "#ef4444", padding: "10px 14px",
              borderRadius: 8, fontSize: 13, marginBottom: 16, textAlign: "center"
            }}>
              {error}
            </div>
          )}

          {/* Email Input */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1a2e2a", marginBottom: 7 }}>
              Email address
            </label>
            <div style={{
              display: "flex", alignItems: "center",
              border: `1.5px solid #e5e7eb`,
              borderRadius: 10, background: "#ffffff",
            }}>
              <div style={{ padding: "0 12px", color: "#6b7280" }}>
                <Mail size={16} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={{
                  flex: 1, border: "none", outline: "none", padding: "12px 0",
                  fontSize: 14, color: "#1a2e2a", background: "transparent",
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1a2e2a", marginBottom: 7 }}>
              Password
            </label>
            <div style={{
              display: "flex", alignItems: "center",
              border: `1.5px solid #e5e7eb`,
              borderRadius: 10, background: "#ffffff",
            }}>
              <div style={{ padding: "0 12px", color: "#6b7280" }}>
                <Lock size={16} />
              </div>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  flex: 1, border: "none", outline: "none", padding: "12px 0",
                  fontSize: 14, color: "#1a2e2a", background: "transparent",
                }}
              />
              <button onClick={() => setShowPw(!showPw)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 12px" }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 22 }}>
            <span style={{ fontSize: 13, color: "#4caf82", fontWeight: 600, cursor: "pointer" }}>
              Forgot password?
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%", padding: "13px", background: loading ? "#6b7280" : "#1a2e2a",
              color: "#ffffff", border: "none", borderRadius: 10, fontWeight: 700,
              fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite"
                }} />
                Signing in…
              </>
            ) : (
              <> Sign In <ArrowRight size={16} /> </>
            )}
          </button>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "#6b7280" }}>
            Don't have an account?{" "}
            <span onClick={onGoSignup} style={{ color: "#4caf82", fontWeight: 700, cursor: "pointer" }}>
              Sign up free
            </span>
          </p>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;