import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, LayoutDashboard, Bell, CheckSquare, BarChart2,
  Upload, Search, ChevronDown, Plus, MoreHorizontal,
  TrendingUp, AlertCircle, Clock, CheckCircle, XCircle,
  LogOut, Settings, Filter, Download, Users,
} from "lucide-react";
import Avatar from "./Avatar";
import StatusBadge from "./StatusBadge";

const CONTRACTS = [
  { id: 1, title: "NDA — Acme Corp", party: "Acme Corporation", value: "$12,400", status: "active", date: "Mar 12, 2025", assigned: "BS" },
  { id: 2, title: "Service Agreement", party: "Stripe Inc.", value: "$8,200", status: "pending", date: "Mar 15, 2025", assigned: "JC" },
  { id: 3, title: "Vendor Contract", party: "AWS Services", value: "$34,000", status: "active", date: "Feb 28, 2025", assigned: "AM" },
  { id: 4, title: "License Agreement", party: "HubSpot Inc.", value: "$5,600", status: "draft", date: "Mar 18, 2025", assigned: "KL" },
  { id: 5, title: "Employment Agreement", party: "Jane Cooper", value: "$72,000", status: "active", date: "Jan 01, 2025", assigned: "DR" },
  { id: 6, title: "Partnership Agreement", party: "Dropbox Business", value: "$18,900", status: "expired", date: "Dec 31, 2024", assigned: "BS" },
];

const STATS = [
  { label: "Active Contracts", value: "124", change: "+12%", icon: CheckCircle, color: "#4caf82" },
  { label: "Pending Review", value: "18", change: "+3", icon: Clock, color: "#f59e0b" },
  { label: "Expiring Soon", value: "6", change: "30d", icon: AlertCircle, color: "#ef4444" },
  { label: "Total Value", value: "$2.4M", change: "+8%", icon: TrendingUp, color: "#6366f1" },
];

const AVATARS = [
  { initials: "BS", bg: "#4caf82" },
  { initials: "JC", bg: "#e67e22" },
  { initials: "AM", bg: "#9b59b6" },
  { initials: "KL", bg: "#e74c3c" },
  { initials: "DR", bg: "#8e44ad" },
];

const CHART_DATA = [42, 68, 53, 80, 62, 91, 74, 85, 68, 93, 78, 88];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Dashboard = ({ user, onLogout }) => {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [searchVal, setSearchVal] = useState("");
  const [notifications, setNotifications] = useState(3);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "contracts", label: "Contracts", icon: FileText },
    { id: "team", label: "Team", icon: Users },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const filtered = CONTRACTS.filter(c =>
    c.title.toLowerCase().includes(searchVal.toLowerCase()) ||
    c.party.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#f4f4f0", overflow: "hidden" }}>
      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        style={{
          width: 220, background: "#1a2e2a", display: "flex", flexDirection: "column",
          flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "#4caf82", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={15} color="#ffffff" />
            </div>
            <span style={{ color: "#ffffff", fontWeight: 800, fontSize: 18 }}>Clause</span>
          </div>
        </div>

        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const active = activeNav === item.id;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setActiveNav(item.id)}
                whileHover={{ x: 2 }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "10px 12px", borderRadius: 9, marginBottom: 2,
                  background: active ? "#4caf8222" : "transparent",
                  border: active ? "1px solid #4caf8233" : "1px solid transparent",
                  cursor: "pointer", color: active ? "#4caf82" : "rgba(255,255,255,0.5)",
                  fontWeight: active ? 700 : 500, fontSize: 13,
                }}
              >
                <Icon size={15} />
                {item.label}
                {item.id === "tasks" && (
                  <span style={{
                    marginLeft: "auto", background: "#4caf82", color: "#ffffff",
                    borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700,
                  }}>4</span>
                )}
              </motion.button>
            );
          })}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Avatar initials={user?.name?.charAt(0) + (user?.name?.split(" ")[1]?.charAt(0) || "") || "U"} bg="#4caf82" size={34} />
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ color: "#ffffff", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name || "User"}</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{user?.email || "user@example.com"}</div>
            </div>
          </div>
          <motion.button
            whileHover={{ x: 2 }}
            onClick={onLogout}
            style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.35)", fontSize: 12,
              padding: "6px 0", fontWeight: 500,
            }}
          >
            <LogOut size={13} /> Sign out
          </motion.button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            height: 64, background: "#ffffff", borderBottom: "1px solid #e5e7eb",
            display: "flex", alignItems: "center", padding: "0 28px",
            justifyContent: "space-between", flexShrink: 0,
          }}
        >
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 20, color: "#1a2e2a", margin: 0 }}>Dashboard</h1>
            <p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>Welcome back, {user?.name?.split(" ")[0] || "User"} 👋</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#f4f4f0", borderRadius: 9, padding: "8px 14px",
              border: "1px solid #e5e7eb", width: 220,
            }}>
              <Search size={14} color="#6b7280" />
              <input
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search contracts…"
                style={{
                  border: "none", outline: "none", background: "transparent",
                  fontSize: 13, color: "#1a2e2a", width: "100%",
                }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setNotifications(0)}
              style={{ position: "relative", background: "none", border: "none", cursor: "pointer", display: "flex" }}
            >
              <Bell size={18} color="#1a2e2a" />
              {notifications > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: "absolute", top: -4, right: -4, width: 16, height: 16,
                    background: "#ef4444", borderRadius: "50%", color: "#ffffff",
                    fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {notifications}
                </motion.div>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                background: "#1a2e2a", color: "#ffffff", border: "none", borderRadius: 9,
                padding: "9px 16px", fontWeight: 700, fontSize: 13,
                cursor: "pointer",
              }}
            >
              <Plus size={14} /> New Contract
            </motion.button>
          </div>
        </motion.header>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          {/* STAT CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -3 }}
                  style={{
                    background: "#ffffff", borderRadius: 14, padding: "20px 20px",
                    border: "1px solid #e5e7eb", cursor: "pointer",
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
                  <div style={{ fontWeight: 800, fontSize: 26, color: "#1a2e2a", marginBottom: 2 }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          {/* CHART + ACTIVITY */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, marginBottom: 24 }}>
            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ background: "#ffffff", borderRadius: 14, padding: 24, border: "1px solid #e5e7eb" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: 16, color: "#1a2e2a", margin: 0 }}>Contract Volume</h3>
                  <p style={{ color: "#6b7280", fontSize: 12, margin: "3px 0 0" }}>Total contracts signed per month</p>
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "#f4f4f0", borderRadius: 8, padding: "6px 12px",
                  fontSize: 12, fontWeight: 600, color: "#1a2e2a", cursor: "pointer",
                }}>
                  2025 <ChevronDown size={12} />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                {CHART_DATA.map((val, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ delay: i * 0.04 + 0.2 }}
                    style={{ flex: 1, position: "relative" }}
                  >
                    <div style={{
                      height: "100%",
                      background: i === 11 ? "#4caf82" : i === 9 ? "#1a2e2a" : "#e5e7eb",
                      borderRadius: "4px 4px 0 0", cursor: "pointer",
                    }} />
                  </motion.div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {MONTHS.map((m, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "#6b7280", fontWeight: 500 }}>{m}</div>
                ))}
              </div>
            </motion.div>

            {/* Activity */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              style={{ background: "#ffffff", borderRadius: 14, padding: 20, border: "1px solid #e5e7eb" }}
            >
              <h3 style={{ fontWeight: 800, fontSize: 15, color: "#1a2e2a", marginBottom: 16 }}>Recent Activity</h3>
              {[
                { icon: Upload, color: "#4caf82", msg: "New contract uploaded", who: "BS", time: "2m ago" },
                { icon: CheckCircle, color: "#22c55e", msg: "Agreement signed", who: "JC", time: "14m ago" },
                { icon: AlertCircle, color: "#f59e0b", msg: "Review requested", who: "AM", time: "1h ago" },
                { icon: XCircle, color: "#ef4444", msg: "Contract expired", who: "KL", time: "3h ago" },
              ].map((item, i) => {
                const Icon = item.icon;
                const av = AVATARS.find(a => a.initials === item.who);
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    paddingBottom: 12, marginBottom: 12,
                    borderBottom: i < 3 ? "1px solid #e5e7eb" : "none",
                  }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${item.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={14} color={item.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#1a2e2a" }}>{item.msg}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{item.time}</div>
                    </div>
                    {av && <Avatar initials={av.initials} bg={av.bg} size={26} />}
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* CONTRACTS TABLE */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ background: "#ffffff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden" }}
          >
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "18px 22px", borderBottom: "1px solid #e5e7eb",
            }}>
              <h3 style={{ fontWeight: 800, fontSize: 15, color: "#1a2e2a", margin: 0 }}>
                All Contracts
                <span style={{ marginLeft: 8, background: "#f4f4f0", borderRadius: 20, padding: "2px 9px", fontSize: 12, color: "#6b7280", fontWeight: 600 }}>
                  {filtered.length}
                </span>
              </h3>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "#f4f4f0", border: "1px solid #e5e7eb", borderRadius: 8,
                  padding: "7px 13px", fontSize: 12, fontWeight: 600, color: "#1a2e2a",
                  cursor: "pointer",
                }}>
                  <Filter size={12} /> Filter
                </button>
                <button style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "#f4f4f0", border: "1px solid #e5e7eb", borderRadius: 8,
                  padding: "7px 13px", fontSize: 12, fontWeight: 600, color: "#1a2e2a",
                  cursor: "pointer",
                }}>
                  <Download size={12} /> Export
                </button>
              </div>
            </div>

            <div style={{
              display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 100px 110px 36px",
              padding: "10px 22px", background: "#f4f4f0",
              borderBottom: "1px solid #e5e7eb",
            }}>
              {["Contract", "Party", "Value", "Due Date", "Status", ""].map((h) => (
                <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</div>
              ))}
            </div>

            {filtered.map((c, i) => (
              <div key={c.id} style={{
                display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 100px 110px 36px",
                padding: "14px 22px", borderBottom: i < filtered.length - 1 ? "1px solid #e5e7eb" : "none",
                alignItems: "center", cursor: "pointer",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, background: "#4caf8218", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileText size={13} color="#4caf82" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#1a2e2a" }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>#{c.id.toString().padStart(4, "0")}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{c.party}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a2e2a" }}>{c.value}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{c.date}</div>
                <StatusBadge status={c.status} />
                <MoreHorizontal size={15} color="#6b7280" style={{ cursor: "pointer" }} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;