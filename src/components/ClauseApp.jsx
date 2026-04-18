import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Eye, EyeOff, Mail, Lock, User, ArrowRight,
  LayoutDashboard, Bell, CheckSquare, Zap, BarChart2,
  Upload, ToggleRight, ToggleLeft, Search, ChevronDown,
  Plus, MoreHorizontal, TrendingUp, AlertCircle, Clock,
  CheckCircle, XCircle, LogOut, Settings, HelpCircle,
  ChevronRight, Filter, Download, Star, Users, BriefcaseBusiness,Phone,
} from "lucide-react";

/* ─── DESIGN TOKENS ──────────────────────────────────────────────── */
const C = {
  dark: "#1a2e2a",
  green: "#2d6a4f",
  accent: "#4caf82",
  yellow: "#f0c040",
  light: "#f4f4f0",
  white: "#ffffff",
  muted: "#6b7280",
  border: "#e5e7eb",
  cardBg: "#f9f9f7",
  danger: "#ef4444",
  warning: "#f59e0b",
};

/* ─── ANIMATION VARIANTS ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const slideLeft = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─── HELPERS ────────────────────────────────────────────────────── */
function Avatar({ initials, bg, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, display: "flex", alignItems: "center",
      justifyContent: "center", color: "#fff", fontWeight: 700,
      fontSize: size * 0.33, flexShrink: 0,
      border: `2px solid ${C.white}`, boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    }}>
      {initials}
    </div>
  );
}

function Toggle({ on }) {
  return on ? <ToggleRight size={22} color={C.accent} /> : <ToggleLeft size={22} color={C.muted} />;
}

function StatusBadge({ status }) {
  const map = {
    active:   { bg: "#dcfce7", color: "#166534", label: "Active" },
    pending:  { bg: "#fef9c3", color: "#713f12", label: "Pending" },
    expired:  { bg: "#fee2e2", color: "#991b1b", label: "Expired" },
    draft:    { bg: "#f3f4f6", color: "#374151", label: "Draft" },
  };
  const s = map[status] || map.draft;
  return (
    <span style={{
      background: s.bg, color: s.color, fontSize: 11, fontWeight: 700,
      borderRadius: 20, padding: "3px 10px", whiteSpace: "nowrap",
    }}>
      {s.label}
    </span>
  );
}

/* ─── INPUT COMPONENT ────────────────────────────────────────────── */
function Input({ icon: Icon, label, type = "text", value, onChange, placeholder, rightEl }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 7 }}>
        {label}
      </label>
      <div style={{
        display: "flex", alignItems: "center",
        border: `1.5px solid ${focused ? C.accent : C.border}`,
        borderRadius: 10, background: C.white,
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: focused ? `0 0 0 3px ${C.accent}22` : "none",
        overflow: "hidden",
      }}>
        {Icon && (
          <div style={{ padding: "0 12px", color: focused ? C.accent : C.muted }}>
            <Icon size={16} />
          </div>
        )}
        <input
          type={type} value={value} onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            flex: 1, border: "none", outline: "none", padding: "12px 0",
            fontSize: 14, color: C.dark, background: "transparent",
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
        {rightEl && <div style={{ padding: "0 12px" }}>{rightEl}</div>}
      </div>
    </div>
  );
}

/* ─── AUTH PANEL (shared left side) ─────────────────────────────── */
function AuthPanel() {
  const contracts = [
    { title: "NDA — Acme Corp", status: "active",  date: "Mar 12" },
    { title: "Service Agreement", status: "pending", date: "Mar 15" },
    { title: "License Deal",      status: "draft",   date: "Mar 18" },
  ];
  return (
    <div style={{
      width: "42%", background: C.dark, padding: "48px 40px",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      position: "relative", overflow: "hidden",
    }}>
      {/* BG decoration */}
      <div style={{
        position: "absolute", top: -80, right: -80, width: 280, height: 280,
        borderRadius: "50%", background: `${C.accent}18`,
      }} />
      <div style={{
        position: "absolute", bottom: -60, left: -60, width: 200, height: 200,
        borderRadius: "50%", background: `${C.yellow}12`,
      }} />

      {/* Logo */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: C.accent, borderRadius: 9,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FileText size={17} color={C.white} />
          </div>
          <span style={{ color: C.white, fontWeight: 800, fontSize: 20 }}>Clause</span>
        </div>
      </motion.div>

      {/* Hero text */}
      <motion.div variants={staggerChildren} initial="hidden" animate="visible" style={{ position: "relative" }}>
        <motion.div variants={fadeUp} custom={1} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: `${C.accent}22`, borderRadius: 20, padding: "5px 13px",
          fontSize: 11, fontWeight: 700, color: C.accent,
          letterSpacing: 1, textTransform: "uppercase", marginBottom: 20,
        }}>
          <Zap size={10} /> CONTRACT INTELLIGENCE
        </motion.div>
        <motion.h2 variants={fadeUp} custom={2} style={{
          color: C.white, fontWeight: 800, fontSize: 30, lineHeight: 1.25, marginBottom: 16,
        }}>
          Manage contracts<br />with confidence
        </motion.h2>
        <motion.p variants={fadeUp} custom={3} style={{
          color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7,
        }}>
          Clause brings your legal team's workflows into one intelligent hub — from drafting to signing.
        </motion.p>

        {/* Mini contract cards */}
        <motion.div variants={staggerChildren} style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 10 }}>
          {contracts.map((c, i) => (
            <motion.div key={i} variants={fadeUp} custom={4 + i} style={{
              background: "rgba(255,255,255,0.07)", borderRadius: 12,
              padding: "12px 16px", display: "flex", alignItems: "center",
              justifyContent: "space-between", border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 30, height: 30, background: `${C.accent}22`, borderRadius: 7,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <FileText size={13} color={C.accent} />
                </div>
                <div>
                  <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{c.title}</div>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{c.date}</div>
                </div>
              </div>
              <StatusBadge status={c.status} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Testimonial */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={8} style={{
        position: "relative",
        borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24,
      }}>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>
          "Clause cut our contract review time in half and gave us visibility we never had before."
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar initials="DR" bg="#8e44ad" size={34} />
          <div>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 13 }}>Darlene Robertson</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>Head of Strategy, Mailchimp</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── LOGIN PAGE ─────────────────────────────────────────────────── */
function LoginPage({ onLogin, onGoSignup }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1400);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <AuthPanel />

      <motion.div
        variants={slideLeft} initial="hidden" animate="visible"
        style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "40px 48px", background: C.light,
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>
          <motion.div variants={staggerChildren} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} style={{ marginBottom: 36 }}>
              <h1 style={{ fontWeight: 800, fontSize: 28, color: C.dark, marginBottom: 8 }}>
                Welcome back
              </h1>
              <p style={{ color: C.muted, fontSize: 14 }}>
                Sign in to your Clause account
              </p>
            </motion.div>

            {/* Social login */}
            <motion.div variants={fadeUp} style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              {[
                { label: "Google", icon: "G", bg: "#fff" },
                { label: "Microsoft", icon: "M", bg: "#fff" },
              ].map((s) => (
                <motion.button
                  key={s.label}
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    flex: 1, padding: "11px", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 8, border: `1.5px solid ${C.border}`,
                    borderRadius: 10, background: C.white, cursor: "pointer",
                    fontSize: 13, fontWeight: 600, color: C.dark, fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <span style={{
                    width: 18, height: 18, borderRadius: 4, background: C.dark,
                    color: C.white, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 10, fontWeight: 800,
                  }}>
                    {s.icon}
                  </span>
                  {s.label}
                </motion.button>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 24,
            }}>
              <div style={{ flex: 1, height: 1, background: C.border }} />
              <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>or continue with email</span>
              <div style={{ flex: 1, height: 1, background: C.border }} />
            </motion.div>

            <motion.div variants={fadeUp}>
              <Input icon={Mail} label="Email address" type="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com" />
              <Input icon={Lock} label="Password" type={showPw ? "text" : "password"}
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                rightEl={
                  <button onClick={() => setShowPw(!showPw)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, display: "flex" }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />
            </motion.div>

            <motion.div variants={fadeUp} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 22, marginTop: -6 }}>
              <span style={{ fontSize: 13, color: C.accent, fontWeight: 600, cursor: "pointer" }}>
                Forgot password?
              </span>
            </motion.div>

            <motion.div variants={fadeUp}>
              <motion.button
                whileHover={{ scale: 1.01, boxShadow: `0 8px 24px ${C.dark}44` }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                style={{
                  width: "100%", padding: "13px", background: loading ? C.muted : C.dark,
                  color: C.white, border: "none", borderRadius: 10, fontWeight: 700,
                  fontSize: 15, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "background 0.2s",
                }}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }}
                    />
                    Signing in…
                  </>
                ) : (
                  <> Sign In <ArrowRight size={16} /> </>
                )}
              </motion.button>
            </motion.div>

            <motion.p variants={fadeUp} style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: C.muted }}>
              Don't have an account?{" "}
              <span onClick={onGoSignup} style={{ color: C.accent, fontWeight: 700, cursor: "pointer" }}>
                Sign up free
              </span>
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── SIGNUP PAGE ────────────────────────────────────────────────── */
function SignupPage({ onSignup, onGoLogin }) {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [agreed, setAgreed]     = useState(false);
  const [loading, setLoading]   = useState(false);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ["#e5e7eb", C.danger, C.warning, C.accent];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  const handleSubmit = () => {
    if (!agreed) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onSignup(); }, 1400);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <AuthPanel />

      <motion.div
        variants={slideLeft} initial="hidden" animate="visible"
        style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "40px 48px", background: C.light, overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>
          <motion.div variants={staggerChildren} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} style={{ marginBottom: 32 }}>
              <h1 style={{ fontWeight: 800, fontSize: 28, color: C.dark, marginBottom: 8 }}>
                Create your account
              </h1>
              <p style={{ color: C.muted, fontSize: 14 }}>
                Start your 14-day free trial — no card required
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Input icon={User} label="Full name" value={name}
                onChange={(e) => setName(e.target.value)} placeholder="Jane Cooper" />
              <Input icon={Mail} label="Work email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
              <Input icon={Lock} label="Password" type={showPw ? "text" : "password"}
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                rightEl={
                  <button onClick={() => setShowPw(!showPw)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, display: "flex" }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />
            </motion.div>

            {/* Password strength */}
            {password.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                style={{ marginTop: -10, marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 2,
                      background: i <= strength ? strengthColors[strength] : C.border,
                      transition: "background 0.3s",
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: strengthColors[strength], fontWeight: 600 }}>
                  {strengthLabels[strength]}
                </div>
              </motion.div>
            )}

            <motion.label variants={fadeUp} style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              marginBottom: 24, cursor: "pointer",
            }}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                style={{ marginTop: 2, accentColor: C.accent, width: 14, height: 14 }} />
              <span style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
                I agree to Clause's{" "}
                <span style={{ color: C.accent, fontWeight: 600 }}>Terms of Service</span> and{" "}
                <span style={{ color: C.accent, fontWeight: 600 }}>Privacy Policy</span>
              </span>
            </motion.label>

            <motion.div variants={fadeUp}>
              <motion.button
                whileHover={{ scale: agreed ? 1.01 : 1, boxShadow: agreed ? `0 8px 24px ${C.dark}44` : "none" }}
                whileTap={{ scale: agreed ? 0.98 : 1 }}
                onClick={handleSubmit}
                style={{
                  width: "100%", padding: "13px",
                  background: agreed ? C.dark : C.border,
                  color: agreed ? C.white : C.muted,
                  border: "none", borderRadius: 10, fontWeight: 700,
                  fontSize: 15, cursor: agreed ? "pointer" : "not-allowed",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "all 0.2s",
                }}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }}
                    />
                    Creating account…
                  </>
                ) : (
                  <> Create Account <ArrowRight size={16} /> </>
                )}
              </motion.button>
            </motion.div>

            <motion.p variants={fadeUp} style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: C.muted }}>
              Already have an account?{" "}
              <span onClick={onGoLogin} style={{ color: C.accent, fontWeight: 700, cursor: "pointer" }}>
                Sign in
              </span>
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── DASHBOARD ──────────────────────────────────────────────────── */
const CONTRACTS = [
  { id: 1, title: "NDA — Acme Corp",        party: "Acme Corporation",    value: "$12,400", status: "active",  date: "Mar 12, 2025", assigned: "BS" },
  { id: 2, title: "Service Agreement",      party: "Stripe Inc.",         value: "$8,200",  status: "pending", date: "Mar 15, 2025", assigned: "JC" },
  { id: 3, title: "Vendor Contract",        party: "AWS Services",        value: "$34,000", status: "active",  date: "Feb 28, 2025", assigned: "AM" },
  { id: 4, title: "License Agreement",      party: "HubSpot Inc.",        value: "$5,600",  status: "draft",   date: "Mar 18, 2025", assigned: "KL" },
  { id: 5, title: "Employment Agreement",   party: "Jane Cooper",         value: "$72,000", status: "active",  date: "Jan 01, 2025", assigned: "DR" },
  { id: 6, title: "Partnership Agreement",  party: "Dropbox Business",    value: "$18,900", status: "expired", date: "Dec 31, 2024", assigned: "BS" },
];

const STATS = [
  { label: "Active Contracts", value: "124",  change: "+12%", icon: CheckCircle,  color: C.accent },
  { label: "Pending Review",   value: "18",   change: "+3",   icon: Clock,        color: C.warning },
  { label: "Expiring Soon",    value: "6",    change: "30d",  icon: AlertCircle,  color: C.danger },
  { label: "Total Value",      value: "$2.4M",change: "+8%",  icon: TrendingUp,   color: "#6366f1" },
];

const AVATARS = [
  { initials: "BS", bg: "#4caf82" },
  { initials: "JC", bg: "#e67e22" },
  { initials: "AM", bg: "#9b59b6" },
  { initials: "KL", bg: "#e74c3c" },
  { initials: "DR", bg: "#8e44ad" },
];

const CHART_DATA = [42, 68, 53, 80, 62, 91, 74, 85, 68, 93, 78, 88];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function DashboardPage({ onLogout }) {
  const [activeNav, setActiveNav]     = useState("dashboard");
  const [searchVal, setSearchVal]     = useState("");
  const [notifications, setNotifications] = useState(3);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: "dashboard", label: "Dashboard",   icon: LayoutDashboard },
    { id: "contracts", label: "Contracts",   icon: FileText },
    { id: "team",      label: "Team",        icon: Users },
    { id: "tasks",     label: "Tasks",       icon: CheckSquare },
    { id: "analytics", label: "Analytics",  icon: BarChart2 },
    { id: "settings",  label: "Settings",   icon: Settings },
  ];

  const filtered = CONTRACTS.filter(c =>
    c.title.toLowerCase().includes(searchVal.toLowerCase()) ||
    c.party.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: C.light, overflow: "hidden" }}>

      {/* ── SIDEBAR ─────────────────────────────────────────────── */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: 220, background: C.dark, display: "flex", flexDirection: "column",
          flexShrink: 0, borderRight: `1px solid rgba(255,255,255,0.06)`,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: C.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={15} color={C.white} />
            </div>
            <span style={{ color: C.white, fontWeight: 800, fontSize: 18 }}>Clause</span>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const active = activeNav === item.id;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                onClick={() => setActiveNav(item.id)}
                whileHover={{ x: 2 }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "10px 12px", borderRadius: 9, marginBottom: 2,
                  background: active ? `${C.accent}22` : "transparent",
                  border: active ? `1px solid ${C.accent}33` : "1px solid transparent",
                  cursor: "pointer", color: active ? C.accent : "rgba(255,255,255,0.5)",
                  fontWeight: active ? 700 : 500, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.18s",
                }}
              >
                <Icon size={15} />
                {item.label}
                {item.id === "tasks" && (
                  <span style={{
                    marginLeft: "auto", background: C.accent, color: C.white,
                    borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700,
                  }}>4</span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* User profile at bottom */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Avatar initials="JC" bg="#4caf82" size={34} />
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Jane Cooper</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>Legal Manager</div>
            </div>
          </div>
          <motion.button
            whileHover={{ x: 2 }}
            onClick={onLogout}
            style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.35)", fontSize: 12, fontFamily: "'DM Sans', sans-serif",
              padding: "6px 0", fontWeight: 500,
            }}
          >
            <LogOut size={13} /> Sign out
          </motion.button>
        </div>
      </motion.aside>

      {/* ── MAIN CONTENT ───────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            height: 64, background: C.white, borderBottom: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", padding: "0 28px",
            justifyContent: "space-between", flexShrink: 0,
          }}
        >
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 20, color: C.dark, margin: 0 }}>Dashboard</h1>
            <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>Welcome back, Jane 👋</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Search */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: C.light, borderRadius: 9, padding: "8px 14px",
              border: `1px solid ${C.border}`, width: 220,
            }}>
              <Search size={14} color={C.muted} />
              <input
                value={searchVal} onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search contracts…"
                style={{
                  border: "none", outline: "none", background: "transparent",
                  fontSize: 13, color: C.dark, fontFamily: "'DM Sans', sans-serif", width: "100%",
                }}
              />
            </div>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setNotifications(0)}
              style={{ position: "relative", background: "none", border: "none", cursor: "pointer", display: "flex" }}
            >
              <Bell size={18} color={C.dark} />
              {notifications > 0 && (
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{
                    position: "absolute", top: -4, right: -4, width: 16, height: 16,
                    background: C.danger, borderRadius: "50%", color: C.white,
                    fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {notifications}
                </motion.div>
              )}
            </motion.button>

            {/* New contract button */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: `0 6px 20px ${C.dark}44` }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                background: C.dark, color: C.white, border: "none", borderRadius: 9,
                padding: "9px 16px", fontWeight: 700, fontSize: 13,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <Plus size={14} /> New Contract
            </motion.button>
          </div>
        </motion.header>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

          {/* STAT CARDS */}
          <motion.div
            variants={staggerChildren} initial="hidden" animate="visible"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}
          >
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i} variants={fadeUp} custom={i}
                  whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
                  style={{
                    background: C.white, borderRadius: 14, padding: "20px 20px",
                    border: `1px solid ${C.border}`, cursor: "pointer",
                    transition: "box-shadow 0.2s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ width: 38, height: 38, background: `${stat.color}18`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={17} color={stat.color} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: stat.color, background: `${stat.color}18`, borderRadius: 20, padding: "3px 8px" }}>
                      {stat.change}
                    </span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 26, color: C.dark, marginBottom: 2 }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CHART + ACTIVITY ROW */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, marginBottom: 24 }}>

            {/* Chart card */}
            <motion.div
              variants={scaleIn} initial="hidden" animate="visible"
              style={{ background: C.white, borderRadius: 14, padding: 24, border: `1px solid ${C.border}` }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: 16, color: C.dark, margin: 0 }}>Contract Volume</h3>
                  <p style={{ color: C.muted, fontSize: 12, margin: "3px 0 0" }}>Total contracts signed per month</p>
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: C.light, borderRadius: 8, padding: "6px 12px",
                  fontSize: 12, fontWeight: 600, color: C.dark, cursor: "pointer",
                }}>
                  2025 <ChevronDown size={12} />
                </div>
              </div>

              {/* Chart */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                {CHART_DATA.map((val, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ delay: i * 0.04 + 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ flex: 1, position: "relative" }}
                  >
                    <motion.div
                      whileHover={{ opacity: 0.85 }}
                      style={{
                        height: "100%",
                        background: i === 11 ? C.accent : i === 9 ? C.dark : "#e5e7eb",
                        borderRadius: "4px 4px 0 0", cursor: "pointer",
                      }}
                    />
                  </motion.div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {MONTHS.map((m, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: C.muted, fontWeight: 500 }}>{m}</div>
                ))}
              </div>
            </motion.div>

            {/* Activity feed */}
            <motion.div
              variants={scaleIn} initial="hidden" animate="visible"
              transition={{ delay: 0.1 }}
              style={{ background: C.white, borderRadius: 14, padding: 20, border: `1px solid ${C.border}` }}
            >
              <h3 style={{ fontWeight: 800, fontSize: 15, color: C.dark, marginBottom: 16 }}>Recent Activity</h3>
              {[
                { icon: Upload,      color: C.accent,   msg: "New contract uploaded",  who: "BS", time: "2m ago" },
                { icon: CheckCircle, color: "#22c55e",  msg: "Agreement signed",        who: "JC", time: "14m ago" },
                { icon: AlertCircle, color: C.warning,  msg: "Review requested",        who: "AM", time: "1h ago" },
                { icon: XCircle,     color: C.danger,   msg: "Contract expired",        who: "KL", time: "3h ago" },
                { icon: Bell,        color: "#6366f1",  msg: "Reminder sent",           who: "DR", time: "5h ago" },
              ].map((item, i) => {
                const Icon = item.icon;
                const av = AVATARS.find(a => a.initials === item.who);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 + 0.3 }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      paddingBottom: 12, marginBottom: 12,
                      borderBottom: i < 4 ? `1px solid ${C.border}` : "none",
                    }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${item.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={14} color={item.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.dark }}>{item.msg}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{item.time}</div>
                    </div>
                    {av && <Avatar initials={av.initials} bg={av.bg} size={26} />}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* CONTRACTS TABLE */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}
          >
            {/* Table header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "18px 22px", borderBottom: `1px solid ${C.border}`,
            }}>
              <h3 style={{ fontWeight: 800, fontSize: 15, color: C.dark, margin: 0 }}>
                All Contracts
                <span style={{ marginLeft: 8, background: C.light, borderRadius: 20, padding: "2px 9px", fontSize: 12, color: C.muted, fontWeight: 600 }}>
                  {filtered.length}
                </span>
              </h3>
              <div style={{ display: "flex", gap: 10 }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: C.light, border: `1px solid ${C.border}`, borderRadius: 8,
                  padding: "7px 13px", fontSize: 12, fontWeight: 600, color: C.dark,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}>
                  <Filter size={12} /> Filter
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: C.light, border: `1px solid ${C.border}`, borderRadius: 8,
                  padding: "7px 13px", fontSize: 12, fontWeight: 600, color: C.dark,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}>
                  <Download size={12} /> Export
                </motion.button>
              </div>
            </div>

            {/* Column headers */}
            <div style={{
              display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 100px 110px 36px",
              padding: "10px 22px", background: C.light,
              borderBottom: `1px solid ${C.border}`,
            }}>
              {["Contract", "Party", "Value", "Due Date", "Status", ""].map((h) => (
                <div key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</div>
              ))}
            </div>

            {/* Rows */}
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.3 }}
                whileHover={{ background: "#f9f9f7" }}
                style={{
                  display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 100px 110px 36px",
                  padding: "14px 22px", borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none",
                  alignItems: "center", cursor: "pointer", transition: "background 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, background: `${C.accent}18`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileText size={13} color={C.accent} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: C.dark }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>#{c.id.toString().padStart(4, "0")}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>{c.party}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{c.value}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{c.date}</div>
                <StatusBadge status={c.status} />
                <motion.button whileHover={{ scale: 1.1 }} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
                  <MoreHorizontal size={15} color={C.muted} />
                </motion.button>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div style={{ padding: 40, textAlign: "center", color: C.muted, fontSize: 14 }}>
                No contracts match your search.
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ─── APP ROOT ───────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("login"); // login | signup | dashboard

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap" rel="stylesheet" />
      <AnimatePresence mode="wait">
        {page === "login" && (
          <motion.div key="login" variants={fadeIn} initial="hidden" animate="visible" exit={{ opacity: 0 }}>
            <LoginPage onLogin={() => setPage("dashboard")} onGoSignup={() => setPage("signup")} />
          </motion.div>
        )}
        {page === "signup" && (
          <motion.div key="signup" variants={fadeIn} initial="hidden" animate="visible" exit={{ opacity: 0 }}>
            <SignupPage onSignup={() => setPage("dashboard")} onGoLogin={() => setPage("login")} />
          </motion.div>
        )}
        {page === "dashboard" && (
          <motion.div key="dashboard" variants={fadeIn} initial="hidden" animate="visible" exit={{ opacity: 0 }}>
            <DashboardPage onLogout={() => setPage("login")} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
