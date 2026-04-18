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
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <AuthPanel />

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "40px 48px", background: "#f4f4f0", overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontWeight: 800, fontSize: 28, color: "#1a2e2a", marginBottom: 8 }}>
              Create your account
            </h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              Start your 14-day free trial — no card required
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

          {/* Name Input */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1a2e2a", marginBottom: 7 }}>
              Full name
            </label>
            <div style={{
              display: "flex", alignItems: "center",
              border: `1.5px solid #e5e7eb`,
              borderRadius: 10, background: "#ffffff",
            }}>
              <div style={{ padding: "0 12px", color: "#6b7280" }}>
                <User size={16} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Cooper"
                style={{
                  flex: 1, border: "none", outline: "none", padding: "12px 0",
                  fontSize: 14, color: "#1a2e2a", background: "transparent",
                }}
              />
            </div>
          </div>

          {/* Email Input */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1a2e2a", marginBottom: 7 }}>
              Work email
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
                placeholder="At least 6 characters"
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

          {/* Password Strength */}
          {password.length > 0 && (
            <div style={{ marginTop: -10, marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{
                    flex: 1, height: 3, borderRadius: 2,
                    background: i <= strength ? strengthColors[strength] : "#e5e7eb",
                  }} />
                ))}
              </div>
              <div style={{ fontSize: 11, color: strengthColors[strength], fontWeight: 600 }}>
                {strengthLabels[strength]}
              </div>
            </div>
          )}

          {/* Terms Agreement */}
          <label style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            marginBottom: 24, cursor: "pointer",
          }}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
              style={{ marginTop: 2, accentColor: "#4caf82", width: 14, height: 14 }} />
            <span style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>
              I agree to Clause's{" "}
              <span style={{ color: "#4caf82", fontWeight: 600 }}>Terms of Service</span> and{" "}
              <span style={{ color: "#4caf82", fontWeight: 600 }}>Privacy Policy</span>
            </span>
          </label>

          <button
            onClick={handleSubmit}
            disabled={loading || !agreed}
            style={{
              width: "100%", padding: "13px",
              background: (agreed && !loading) ? "#1a2e2a" : "#e5e7eb",
              color: (agreed && !loading) ? "#ffffff" : "#6b7280",
              border: "none", borderRadius: 10, fontWeight: 700,
              fontSize: 15, cursor: (agreed && !loading) ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite"
                }} />
                Creating account…
              </>
            ) : (
              <> Create Account <ArrowRight size={16} /> </>
            )}
          </button>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "#6b7280" }}>
            Already have an account?{" "}
            <span onClick={onGoLogin} style={{ color: "#4caf82", fontWeight: 700, cursor: "pointer" }}>
              Sign in
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

export default Signup;