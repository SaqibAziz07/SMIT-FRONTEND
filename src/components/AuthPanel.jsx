import { motion } from "framer-motion";
import { FileText, Zap } from "lucide-react";
import Avatar from "./Avatar";
import StatusBadge from "./StatusBadge";

const AuthPanel = () => {
  const contracts = [
    { title: "NDA — Acme Corp", status: "active", date: "Mar 12" },
    { title: "Service Agreement", status: "pending", date: "Mar 15" },
    { title: "License Deal", status: "draft", date: "Mar 18" },
  ];

  return (
    <div style={{
      width: "42%", background: "#1a2e2a", padding: "48px 40px",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -80, right: -80, width: 280, height: 280,
        borderRadius: "50%", background: "#4caf8218",
      }} />
      <div style={{
        position: "absolute", bottom: -60, left: -60, width: 200, height: 200,
        borderRadius: "50%", background: "#f0c04012",
      }} />

      {/* Logo */}
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: "#4caf82", borderRadius: 9,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FileText size={17} color="#ffffff" />
          </div>
          <span style={{ color: "#ffffff", fontWeight: 800, fontSize: 20 }}>Clause</span>
        </div>
      </div>

      {/* Hero Text */}
      <div style={{ position: "relative" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "#4caf8222", borderRadius: 20, padding: "5px 13px",
          fontSize: 11, fontWeight: 700, color: "#4caf82",
          letterSpacing: 1, textTransform: "uppercase", marginBottom: 20,
        }}>
          <Zap size={10} /> CONTRACT INTELLIGENCE
        </div>
        <h2 style={{
          color: "#ffffff", fontWeight: 800, fontSize: 30, lineHeight: 1.25, marginBottom: 16,
        }}>
          Manage contracts<br />with confidence
        </h2>
        <p style={{
          color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7,
        }}>
          Clause brings your legal team's workflows into one intelligent hub — from drafting to signing.
        </p>

        {/* Mini Contract Cards */}
        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 10 }}>
          {contracts.map((c, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.07)", borderRadius: 12,
              padding: "12px 16px", display: "flex", alignItems: "center",
              justifyContent: "space-between", border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 30, height: 30, background: "#4caf8222", borderRadius: 7,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <FileText size={13} color="#4caf82" />
                </div>
                <div>
                  <div style={{ color: "#ffffff", fontSize: 12, fontWeight: 600 }}>{c.title}</div>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{c.date}</div>
                </div>
              </div>
              <StatusBadge status={c.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial */}
      <div style={{
        position: "relative",
        borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24,
      }}>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>
          "Clause cut our contract review time in half and gave us visibility we never had before."
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar initials="DR" bg="#8e44ad" size={34} />
          <div>
            <div style={{ color: "#ffffff", fontWeight: 700, fontSize: 13 }}>Darlene Robertson</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>Head of Strategy, Mailchimp</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPanel;