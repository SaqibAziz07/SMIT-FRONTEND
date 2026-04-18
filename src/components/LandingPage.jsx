import { useState } from "react";
import {
  LayoutDashboard,
  Bell,
  CheckSquare,
  Zap,
  ChevronDown,
  Mail,
  Phone,
  FileText,
  BarChart2,
  Upload,
  ToggleRight,
  ToggleLeft,
} from "lucide-react";
// React Icons for social media
import { FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";

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
};

/* ─── STYLES ─────────────────────────────────────────────────────── */
const s = {
  page: { fontFamily: "'DM Sans', sans-serif", background: C.white, color: C.dark, overflowX: "hidden" },
  container: { maxWidth: 1100, margin: "0 auto", padding: "0 24px" },

  // nav
  nav: { position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.border}` },
  navInner: { display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, maxWidth: 1100, margin: "0 auto", padding: "0 24px" },
  logo: { display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 18, color: C.dark, textDecoration: "none" },
  logoIcon: { width: 32, height: 32, background: C.dark, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" },
  navLinks: { display: "flex", alignItems: "center", gap: 28, listStyle: "none", margin: 0, padding: 0 },
  navLink: { color: C.muted, fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" },
  navActions: { display: "flex", alignItems: "center", gap: 12 },
  btnGhost: { background: "none", border: "none", cursor: "pointer", color: C.dark, fontWeight: 600, fontSize: 14, padding: "8px 16px" },
  btnDark: { background: C.dark, color: C.white, border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  btnAccent: { background: C.accent, color: C.white, border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  btnOutline: { background: "none", color: C.dark, border: `1.5px solid ${C.dark}`, borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  btnYellow: { background: C.yellow, color: C.dark, border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer" },
  btnOutlineLight: { background: "none", color: C.white, border: `1.5px solid rgba(255,255,255,0.4)`, borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer" },

  // hero
  hero: { background: C.light, padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" },
  heroBadge: { display: "inline-flex", alignItems: "center", gap: 6, background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: C.green, marginBottom: 24 },
  heroH1: { fontSize: "clamp(34px, 5vw, 54px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20, maxWidth: 680, marginLeft: "auto", marginRight: "auto" },
  heroUnderline: { textDecoration: "underline", textDecorationColor: C.yellow, textDecorationThickness: 4 },
  heroSub: { color: C.muted, fontSize: 16, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 32px" },
  heroCtas: { display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" },
  floatAvatarL: { position: "absolute", top: 72, left: "6%", display: "flex", flexDirection: "column", gap: 28 },
  floatAvatarR: { position: "absolute", top: 72, right: "6%", display: "flex", flexDirection: "column", gap: 28 },
  avatarCircle: { borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: C.white, boxShadow: "0 4px 14px rgba(0,0,0,0.12)", border: `3px solid ${C.white}` },

  // partners
  partners: { borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "22px 0", background: C.white },
  partnersInner: { display: "flex", alignItems: "center", gap: 36, justifyContent: "center", flexWrap: "wrap", padding: "0 24px" },
  partnerLabel: { color: C.muted, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" },
  partnerLogo: { color: C.dark, fontSize: 15, fontWeight: 700, opacity: 0.55, whiteSpace: "nowrap" },

  // section
  section: { padding: "80px 24px" },
  sectionBadge: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: C.green, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 },
  sectionH2: { fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 800, textAlign: "center", marginBottom: 14, maxWidth: 580, marginLeft: "auto", marginRight: "auto" },
  sectionSub: { color: C.muted, textAlign: "center", maxWidth: 480, margin: "0 auto 52px", lineHeight: 1.7, fontSize: 15 },

  // feature grid
  featureGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  featureCardDark: { background: C.dark, borderRadius: 16, padding: 28, color: C.white },
  featureCard: { background: C.cardBg, borderRadius: 16, padding: 28, border: `1px solid ${C.border}` },
  featureRightCol: { display: "flex", flexDirection: "column", gap: 16 },
  featureTitle: { fontWeight: 700, fontSize: 18, marginBottom: 8 },
  featureTitleLight: { fontWeight: 700, fontSize: 18, marginBottom: 8, color: C.white },
  featureSub: { color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 16 },
  featureSubLight: { color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.7, marginBottom: 20 },

  // chart
  chartMock: { background: C.white, borderRadius: 12, padding: "14px 16px", border: `1px solid ${C.border}` },
  chartHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, fontSize: 13 },
  chartBars: { display: "flex", alignItems: "flex-end", gap: 6, height: 80 },
  chartBar: { flex: 1, borderRadius: "4px 4px 0 0", minWidth: 10 },

  // notif
  notifHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  notifRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13 },

  // task
  taskHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  taskActivity: { display: "flex", flexDirection: "column", gap: 12 },
  taskUser: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, marginBottom: 6 },
  taskMsg: { background: C.light, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: C.dark },

  // integrations
  intSection: { background: C.dark, padding: "80px 24px", textAlign: "center" },
  intBadge: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 },
  intH2: { fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 800, color: C.white, marginBottom: 14 },
  intSub: { color: "rgba(255,255,255,0.5)", maxWidth: 460, margin: "0 auto", lineHeight: 1.7, fontSize: 15 },
  intLink: { color: C.accent, fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-block", marginTop: 16 },
  intGrid: { display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 40 },
  intIcon: { width: 64, height: 64, background: C.white, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 },

  // testimonial
  testimonialSection: { padding: "80px 24px", textAlign: "center", background: C.white },
  quoteIcon: { fontSize: 48, color: C.muted, lineHeight: 1, marginBottom: 12 },
  quote: { fontSize: "clamp(17px, 2.2vw, 24px)", fontWeight: 700, lineHeight: 1.55, maxWidth: 660, margin: "0 auto 32px", color: C.dark },
  quoteAuthor: { display: "flex", alignItems: "center", justifyContent: "center", gap: 12 },

  // stats
  statsRow: { display: "flex", justifyContent: "center", gap: 64, flexWrap: "wrap", padding: "40px 24px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` },
  statNum: { fontSize: 42, fontWeight: 800, marginBottom: 4 },
  statLabel: { color: C.muted, fontSize: 14 },

  // cta band
  ctaBand: { background: C.dark, padding: "52px 24px" },
  ctaBandInner: { maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 },
  ctaH2: { fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: C.white, maxWidth: 440, lineHeight: 1.3 },
  ctaUnderline: { textDecoration: "underline", textDecorationColor: C.accent, textDecorationThickness: 3 },
  ctaBtns: { display: "flex", gap: 12, flexWrap: "wrap" },

  // footer
  footer: { background: "#111c18", padding: "52px 24px 24px" },
  footerGrid: { display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 36, maxWidth: 1100, margin: "0 auto 40px" },
  footerLogo: { display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 16, color: C.white, marginBottom: 16, textDecoration: "none" },
  footerLogoIcon: { width: 28, height: 28, background: "rgba(255,255,255,0.1)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" },
  footerContact: { color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 },
  footerColTitle: { color: C.white, fontWeight: 700, fontSize: 14, marginBottom: 16 },
  footerLink: { color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 10, display: "block", cursor: "pointer", textDecoration: "none" },
  footerBottom: { borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1100, margin: "0 auto", flexWrap: "wrap", gap: 12 },
  footerCopy: { color: "rgba(255,255,255,0.28)", fontSize: 12 },
  footerSocials: { display: "flex", gap: 16 },
  socialIcon: { color: "rgba(255,255,255,0.5)", cursor: "pointer", transition: "color 0.2s", fontSize: 18 },
};

/* ─── HELPERS ────────────────────────────────────────────────────── */
function Avatar({ initials, bg, size = 48 }) {
  return (
    <div style={{ ...s.avatarCircle, background: bg, width: size, height: size, fontSize: size * 0.33 }}>
      {initials}
    </div>
  );
}

function Toggle({ on }) {
  return on
    ? <ToggleRight size={22} color={C.accent} />
    : <ToggleLeft size={22} color={C.muted} />;
}

function ChartDemo() {
  const bars = [
    { h: 28, c: "#e5e7eb" }, { h: 48, c: "#e5e7eb" }, { h: 36, c: "#e5e7eb" },
    { h: 72, c: C.dark },   { h: 52, c: "#e5e7eb" }, { h: 80, c: C.accent },
    { h: 58, c: "#e5e7eb" },
  ];
  return (
    <div style={s.chartMock}>
      <div style={s.chartHeader}>
        <span style={{ fontWeight: 600 }}>Acme Inc. ▾</span>
        <div style={{ display: "flex", gap: 4 }}>
          {["🟤","🟢","🔵","🔴"].map((e, i) => <span key={i} style={{ fontSize: 9 }}>{e}</span>)}
        </div>
      </div>
      <div style={s.chartBars}>
        {bars.map((b, i) => (
          <div key={i} style={{ ...s.chartBar, height: b.h, background: b.c }} />
        ))}
      </div>
    </div>
  );
}

function NotifDemo() {
  const rows = [
    { label: "New messages, comment, or replies", on: true },
    { label: "Social emails", on: false },
    { label: "Announcement and Update", on: true },
    { label: "Reminders", on: false },
  ];
  return (
    <div>
      <div style={s.notifHeader}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>Email notification</span>
        <span style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>Save</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} style={s.notifRow}>
          <span style={{ color: C.muted, fontSize: 13 }}>{r.label}</span>
          <Toggle on={r.on} />
        </div>
      ))}
    </div>
  );
}

function TaskDemo() {
  return (
    <div>
      <div style={s.taskHeader}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>Activity</span>
        <span style={{ fontSize: 12, color: C.accent, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
          + Message
        </span>
      </div>
      <div style={s.taskActivity}>
        <div>
          <div style={s.taskUser}>
            <Avatar initials="BS" bg="#4caf82" size={28} />
            Bill Sanders
          </div>
          <div style={s.taskMsg}>
            Hello <strong>@Hugo Dillon</strong>, Could you sign the contract before the March 12? Thank you in advance 😊
          </div>
        </div>
        <div>
          <div style={s.taskUser}>
            <Avatar initials="JC" bg="#e67e22" size={28} />
            Jane Cooper
          </div>
          <div style={{ ...s.taskMsg, display: "flex", alignItems: "center", gap: 8 }}>
            <Upload size={13} color={C.green} /> Uploaded new contract
          </div>
        </div>
      </div>
    </div>
  );
}

const INT_EMOJIS = ["💬","📓","📋","💳","📁","📢","🔄","🗂️","🎨","🌿","⚙️","🎫","📊","♻️","🛒","🔗"];

/* ─── LANDING PAGE ───────────────────────────────────────────────── */
export default function LandingPage({ onGetStarted, onOpenSignup }) {
  return (
    <div style={s.page}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap"
        rel="stylesheet"
      />

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <a href="#" style={s.logo}>
            <div style={s.logoIcon}><FileText size={15} color={C.white} /></div>
            Clause
          </a>
          <ul style={s.navLinks}>
            {["Solutions", "Customers", "Pricing"].map((item) => (
              <li key={item}>
                <a href="#" style={s.navLink}>
                  {item} {item !== "Pricing" && <ChevronDown size={13} />}
                </a>
              </li>
            ))}
          </ul>
          <div style={s.navActions}>
            <button style={s.btnGhost} onClick={onGetStarted}>Log In</button>
            <button style={s.btnDark} onClick={onOpenSignup}>Start Now</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section style={s.hero}>
        <div style={s.floatAvatarL}>
          <Avatar initials="AM" bg="#9b59b6" />
          <Avatar initials="KL" bg="#e74c3c" />
        </div>
        <div style={s.floatAvatarR}>
          <Avatar initials="JD" bg="#f39c12" />
          <Avatar initials="SR" bg="#3498db" />
        </div>

        <div>
          <div style={s.heroBadge}>
            <Zap size={11} /> CREATE FOR FAST
          </div>
          <h1 style={s.heroH1}>
            One tool to <span style={s.heroUnderline}>manage</span>
            <br />contracts and your team
          </h1>
          <p style={s.heroSub}>
            Clause helps legal teams work faster, smarter and more efficiently, delivering
            the visibility and data-driven insights to mitigate risk and ensure compliance.
          </p>
          <div style={s.heroCtas}>
            <button style={s.btnDark} onClick={onOpenSignup}>Start for Free</button>
            <button style={s.btnOutline} onClick={onGetStarted}>Get a Demo</button>
          </div>
        </div>
      </section>

      {/* ── PARTNERS ─────────────────────────────────────────────── */}
      <div style={s.partners}>
        <div style={s.partnersInner}>
          <span style={s.partnerLabel}>More than 100+ companies partner</span>
          {["HubSpot", "✦ Dropbox", "□ Square", "INTERCOM", "grammarly"].map((p) => (
            <span key={p} style={s.partnerLogo}>{p}</span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section style={s.section}>
        <div style={s.container}>
          <div style={{ textAlign: "center" }}>
            <span style={s.sectionBadge}><LayoutDashboard size={11} /> FEATURES</span>
          </div>
          <h2 style={s.sectionH2}>
            Latest advanced technologies to ensure everything you needs
          </h2>
          <p style={s.sectionSub}>
            Maximize your team's productivity and security with our affordable,
            user-friendly contract management system.
          </p>

          <div style={s.featureGrid}>
            <div style={s.featureCardDark}>
              <BarChart2 size={22} color={C.accent} style={{ marginBottom: 14 }} />
              <div style={s.featureTitleLight}>Dynamic dashboard</div>
              <p style={s.featureSubLight}>
                Clause helps legal teams work faster, smarter and more efficiently,
                delivering the visibility and data-driven insights to mitigate risk and
                ensure compliance.
              </p>
              <button style={{ ...s.btnAccent, fontSize: 13, marginBottom: 20 }} onClick={onOpenSignup}>
                Explore all
              </button>
              <ChartDemo />
            </div>

            <div style={s.featureRightCol}>
              <div style={s.featureCard}>
                <Bell size={20} color={C.accent} style={{ marginBottom: 10 }} />
                <div style={s.featureTitle}>Smart notifications</div>
                <p style={s.featureSub}>
                  Easily accessible from the notifications center, calendar or email
                  with the relevant activities.
                </p>
                <NotifDemo />
              </div>
              <div style={s.featureCard}>
                <CheckSquare size={20} color={C.accent} style={{ marginBottom: 10 }} />
                <div style={s.featureTitle}>Task management</div>
                <p style={s.featureSub}>
                  Discuss contract queries, manage tasks, secure approvals, track progress
                  in the workspace.
                </p>
                <TaskDemo />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ─────────────────────────────────────────── */}
      <section style={s.intSection}>
        <span style={s.intBadge}><Zap size={11} /> INTEGRATIONS</span>
        <h2 style={s.intH2}>Don't replace. Integrate.</h2>
        <p style={s.intSub}>
          We understand the hassle of replacing the long-used tools in your process.
          That's why we integrate tools you use in your day-to-day work.
        </p>
        <a href="#" style={s.intLink}>All Integrations →</a>
        <div style={s.intGrid}>
          {INT_EMOJIS.map((emoji, i) => (
            <div key={i} style={s.intIcon}>{emoji}</div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIAL ──────────────────────────────────────────── */}
      <section style={s.testimonialSection}>
        <div style={s.quoteIcon}>"</div>
        <p style={s.quote}>
          Clause is helping our company to decrease operational expenses and turnaround time,
          while increasing the compliance, resource allocation and effectiveness of our
          contract management.
        </p>
        <div style={s.quoteAuthor}>
          <Avatar initials="DR" bg="#8e44ad" size={44} />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Darlene Robertson</div>
            <div style={{ color: C.muted, fontSize: 13 }}>Head of Strategy at Mailchimp</div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────── */}
      <div style={s.statsRow}>
        {[
          { num: "2021", label: "Clause Founded" },
          { num: "50K+", label: "Active Users" },
          { num: "1k+",  label: "Company Partners" },
        ].map((stat) => (
          <div key={stat.num} style={{ textAlign: "center" }}>
            <div style={s.statNum}>{stat.num}</div>
            <div style={s.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── CTA BAND ─────────────────────────────────────────────── */}
      <div style={s.ctaBand}>
        <div style={s.ctaBandInner}>
          <h2 style={s.ctaH2}>
            Discover the full scale of{" "}
            <span style={s.ctaUnderline}>Clause</span> capabilities
          </h2>
          <div style={s.ctaBtns}>
            <button style={s.btnOutlineLight} onClick={onGetStarted}>Get a Demo</button>
            <button style={s.btnYellow} onClick={onOpenSignup}>Start for Free</button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={s.footer}>
        <div style={s.footerGrid}>
          <div>
            <a href="#" style={s.footerLogo}>
              <div style={s.footerLogoIcon}><FileText size={14} color={C.white} /></div>
              Clause
            </a>
            <div style={s.footerContact}><Mail size={13} /> hello@clause.com</div>
            <div style={s.footerContact}><Phone size={13} /> +621 987 654 321</div>
          </div>

          {[
            { title: "Solution",   links: ["Why Clause","Features","OpenAI","Technology","Security"] },
            { title: "Customers",  links: ["Procurement","Sales","Legal","Medium","Enterprise"] },
            { title: "Resources",  links: ["Pricing","Contact Sales","Changelog","Blog"] },
          ].map((col) => (
            <div key={col.title}>
              <div style={s.footerColTitle}>{col.title}</div>
              {col.links.map((l) => <a key={l} href="#" style={s.footerLink}>{l}</a>)}
            </div>
          ))}
        </div>

        <div style={s.footerBottom}>
          <span style={s.footerCopy}>© Copyright 2024 Clause. All rights reserved.</span>
          <div style={s.footerSocials}>
            <FaTwitter 
              size={16} 
              style={s.socialIcon}
              onMouseEnter={(e) => e.currentTarget.style.color = "#1DA1F2"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
            />
            <FaLinkedin 
              size={16} 
              style={s.socialIcon}
              onMouseEnter={(e) => e.currentTarget.style.color = "#0077B5"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
            />
            <FaInstagram 
              size={16} 
              style={s.socialIcon}
              onMouseEnter={(e) => e.currentTarget.style.color = "#E4405F"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
            />
            <FaYoutube 
              size={16} 
              style={s.socialIcon}
              onMouseEnter={(e) => e.currentTarget.style.color = "#FF0000"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}