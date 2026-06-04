import emailjs from "@emailjs/browser";
import { registerRider, getScore } from "./services/api";
import { useState, useEffect, useCallback } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";
// ============================================================
// TRANSLATIONS
// ============================================================
const T = {
  en: {
    appName: "Road Warrior Rider Network",
    tagline: "Join 10,000+ delivery riders. Earn rewards. Ride smarter.",
    startSurvey: "Register Now",
    checkScore: "My Score",
    adminDash: "Dashboard",
    langSelect: "Language",
    // Form
    step: "Step",
    of: "of",
    next: "Next",
    back: "Back",
    submit: "Submit Registration",
    // Section A
    sectionA: "Basic Profile",
    fullName: "Full Name",
    whatsapp: "WhatsApp Number",
    city: "City",
    email: "Email",
    platform: "Delivery Platform",
    experience: "Years of Experience",
    // Section B
    sectionB: "Your Vehicle",
    vehicleType: "Current Vehicle Type",
    vehicleModel: "Vehicle Model (optional)",
    fuelingMethod: "Fueling Method",
    weeklyCost: "Weekly Fuel Cost (₹)",
    maintenanceCost: "Monthly Maintenance Cost (₹)",
    // Section C
    sectionC: "Challenges",
    generalChallenges: "Your Main Challenges",
    // Section D
    sectionD: "Insurance",
    accidentalIns: "Do you have Accidental Insurance?",
    healthIns: "Do you have Health Insurance?",
    accidentExpense: "Paid out-of-pocket for accident?",
    // Section E
    sectionE: "Openness to Change",
    evInterest: "Are you open to switching to EV?",
    switchMotivators: "What would motivate you to switch?",
    interestedServices: "What services interest you?",
    // Section F
    sectionF: "Referral",
    referredBy: "Were you referred by someone?",
    referralCode: "Enter Referral Code",
    // Success
    successTitle: "You're registered! 🎉",
    successPoints: "You earned 10 points!",
    yourCode: "Your Referral Code",
    shareMsg: "Share with friends to earn +5 points each!",
    copyCode: "Copy Code",
    copied: "Copied!",
    // Score page
    scoreTitle: "My Score",
    enterPhone: "Enter your WhatsApp number",
    checkBtn: "Check Score",
    points: "Points",
    referrals: "Referrals",
    milestones: "Milestones",
    // Dashboard
    dashTitle: "Admin Dashboard",
    totalRiders: "Total Riders",
    hotLeads: "Hot EV Leads",
    insuranceLeads: "Insurance Leads",
    retrofitLeads: "Retrofit Leads",
    topReferrers: "Top Referrers",
    cityBreakdown: "City Breakdown",
    vehicleBreakdown: "Vehicle Breakdown",
    recentRiders: "Recent Registrations",
    exportCSV: "Export CSV",
    searchPlaceholder: "Search by name or phone...",
    yes: "Yes", no: "No",
    alreadyRegistered: "You are already registered! Check your score below.",
    required: "This field is required",
  },
  hi: {
    appName: "रोड वॉरियर राइडर नेटवर्क",
    tagline: "10,000+ डिलीवरी राइडर से जुड़ें। रिवॉर्ड कमाएं। स्मार्ट राइड करें।",
    startSurvey: "अभी रजिस्टर करें",
    checkScore: "मेरा स्कोर",
    adminDash: "डैशबोर्ड",
    langSelect: "भाषा",
    step: "चरण",
    of: "का",
    next: "आगे",
    back: "पीछे",
    submit: "रजिस्ट्रेशन सबमिट करें",
    sectionA: "बेसिक प्रोफाइल",
    fullName: "पूरा नाम",
    whatsapp: "WhatsApp नंबर",
    email: "ईमेल",
    city: "शहर",
    platform: "डिलीवरी प्लेटफॉर्म",
    experience: "अनुभव (वर्षों में)",
    sectionB: "आपका वाहन",
    vehicleType: "वर्तमान वाहन प्रकार",
    vehicleModel: "वाहन मॉडल (वैकल्पिक)",
    fuelingMethod: "ईंधन विधि",
    weeklyCost: "साप्ताहिक ईंधन लागत (₹)",
    maintenanceCost: "मासिक रखरखाव लागत (₹)",
    sectionC: "चुनौतियां",
    generalChallenges: "आपकी मुख्य चुनौतियां",
    sectionD: "बीमा",
    accidentalIns: "क्या आपके पास दुर्घटना बीमा है?",
    healthIns: "क्या आपके पास स्वास्थ्य बीमा है?",
    accidentExpense: "दुर्घटना के लिए खुद पैसे दिए?",
    sectionE: "बदलाव की इच्छा",
    evInterest: "क्या आप EV में स्विच करना चाहते हैं?",
    switchMotivators: "स्विच के लिए क्या प्रेरित करेगा?",
    interestedServices: "कौन सी सेवाएं चाहते हैं?",
    sectionF: "रेफरल",
    referredBy: "क्या किसी ने रेफर किया?",
    referralCode: "रेफरल कोड दर्ज करें",
    successTitle: "रजिस्ट्रेशन हो गया! 🎉",
    successPoints: "आपने 10 पॉइंट कमाए!",
    yourCode: "आपका रेफरल कोड",
    shareMsg: "दोस्तों के साथ शेयर करें और +5 पॉइंट कमाएं!",
    copyCode: "कोड कॉपी करें",
    copied: "कॉपी हो गया!",
    scoreTitle: "मेरा स्कोर",
    enterPhone: "अपना WhatsApp नंबर दर्ज करें",
    checkBtn: "स्कोर देखें",
    points: "पॉइंट्स",
    referrals: "रेफरल",
    milestones: "माइलस्टोन",
    dashTitle: "एडमिन डैशबोर्ड",
    totalRiders: "कुल राइडर",
    hotLeads: "हॉट EV लीड",
    insuranceLeads: "इंश्योरेंस लीड",
    retrofitLeads: "रेट्रोफिट लीड",
    topReferrers: "टॉप रेफरर",
    cityBreakdown: "शहर विवरण",
    vehicleBreakdown: "वाहन विवरण",
    recentRiders: "हाल के रजिस्ट्रेशन",
    exportCSV: "CSV निर्यात करें",
    searchPlaceholder: "नाम या फोन से खोजें...",
    yes: "हाँ", no: "नहीं",
    alreadyRegistered: "आप पहले से रजिस्टर हैं! नीचे अपना स्कोर देखें।",
    required: "यह फ़ील्ड आवश्यक है",
  },
  kn: {
    appName: "ರೋಡ್ ವಾರಿಯರ್ ರೈಡರ್ ನೆಟ್‌ವರ್ಕ್",
    tagline: "10,000+ ಡೆಲಿವರಿ ರೈಡರ್‌ಗಳೊಂದಿಗೆ ಸೇರಿ. ರಿವಾರ್ಡ್ ಗಳಿಸಿ.",
    startSurvey: "ಈಗ ನೋಂದಾಯಿಸಿ",
    checkScore: "ನನ್ನ ಸ್ಕೋರ್",
    adminDash: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    langSelect: "ಭಾಷೆ",
    step: "ಹಂತ",
    of: "ರಲ್ಲಿ",
    next: "ಮುಂದೆ",
    back: "ಹಿಂದೆ",
    submit: "ನೋಂದಣಿ ಸಲ್ಲಿಸಿ",
    sectionA: "ಮೂಲ ಪ್ರೊಫೈಲ್",
    fullName: "ಪೂರ್ಣ ಹೆಸರು",
    whatsapp: "WhatsApp ಸಂಖ್ಯೆ",
    email: "ಇಮೇಲ್",
    city: "ನಗರ",
    platform: "ಡೆಲಿವರಿ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್",
    experience: "ಅನುಭವ (ವರ್ಷಗಳು)",
    sectionB: "ನಿಮ್ಮ ವಾಹನ",
    vehicleType: "ಪ್ರಸ್ತುತ ವಾಹನ ಪ್ರಕಾರ",
    vehicleModel: "ವಾಹನ ಮಾದರಿ (ಐಚ್ಛಿಕ)",
    fuelingMethod: "ಇಂಧನ ವಿಧಾನ",
    weeklyCost: "ವಾರದ ಇಂಧನ ವೆಚ್ಚ (₹)",
    maintenanceCost: "ಮಾಸಿಕ ನಿರ್ವಹಣೆ ವೆಚ್ಚ (₹)",
    sectionC: "ಸವಾಲುಗಳು",
    generalChallenges: "ನಿಮ್ಮ ಮುಖ್ಯ ಸವಾಲುಗಳು",
    sectionD: "ವಿಮೆ",
    accidentalIns: "ನಿಮಗೆ ಅಪಘಾತ ವಿಮೆ ಇದೆಯೇ?",
    healthIns: "ನಿಮಗೆ ಆರೋಗ್ಯ ವಿಮೆ ಇದೆಯೇ?",
    accidentExpense: "ಅಪಘಾತಕ್ಕೆ ಸ್ವಂತ ಹಣ ಕೊಟ್ಟಿದ್ದೀರಾ?",
    sectionE: "ಬದಲಾವಣೆಗೆ ಮನಸ್ಸು",
    evInterest: "EV ಗೆ ಬದಲಾಯಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
    switchMotivators: "ಬದಲಾವಣೆಗೆ ಏನು ಪ್ರೇರೇಪಿಸುತ್ತದೆ?",
    interestedServices: "ಯಾವ ಸೇವೆಗಳು ಬೇಕು?",
    sectionF: "ರೆಫರಲ್",
    referredBy: "ಯಾರಾದರೂ ರೆಫರ್ ಮಾಡಿದ್ದಾರೆಯೇ?",
    referralCode: "ರೆಫರಲ್ ಕೋಡ್ ನಮೂದಿಸಿ",
    successTitle: "ನೋಂದಣಿ ಆಯಿತು! 🎉",
    successPoints: "ನೀವು 10 ಪಾಯಿಂಟ್‌ಗಳನ್ನು ಗಳಿಸಿದ್ದೀರಿ!",
    yourCode: "ನಿಮ್ಮ ರೆಫರಲ್ ಕೋಡ್",
    shareMsg: "ಸ್ನೇಹಿತರೊಂದಿಗೆ ಶೇರ್ ಮಾಡಿ ಮತ್ತು +5 ಪಾಯಿಂಟ್ ಗಳಿಸಿ!",
    copyCode: "ಕೋಡ್ ಕಾಪಿ ಮಾಡಿ",
    copied: "ಕಾಪಿ ಆಯಿತು!",
    scoreTitle: "ನನ್ನ ಸ್ಕೋರ್",
    enterPhone: "ನಿಮ್ಮ WhatsApp ಸಂಖ್ಯೆ ನಮೂದಿಸಿ",
    checkBtn: "ಸ್ಕೋರ್ ನೋಡಿ",
    points: "ಪಾಯಿಂಟ್‌ಗಳು",
    referrals: "ರೆಫರಲ್‌ಗಳು",
    milestones: "ಮೈಲ್‌ಸ್ಟೋನ್‌ಗಳು",
    dashTitle: "ಅಡ್ಮಿನ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    totalRiders: "ಒಟ್ಟು ರೈಡರ್‌ಗಳು",
    hotLeads: "ಹಾಟ್ EV ಲೀಡ್ಸ್",
    insuranceLeads: "ವಿಮೆ ಲೀಡ್ಸ್",
    retrofitLeads: "ರೆಟ್ರೋಫಿಟ್ ಲೀಡ್ಸ್",
    topReferrers: "ಟಾಪ್ ರೆಫರರ್‌ಗಳು",
    cityBreakdown: "ನಗರ ವಿವರ",
    vehicleBreakdown: "ವಾಹನ ವಿವರ",
    recentRiders: "ಇತ್ತೀಚಿನ ನೋಂದಣಿಗಳು",
    exportCSV: "CSV ರಫ್ತು ಮಾಡಿ",
    searchPlaceholder: "ಹೆಸರು ಅಥವಾ ಫೋನ್‌ನಿಂದ ಹುಡುಕಿ...",
    yes: "ಹೌದು", no: "ಇಲ್ಲ",
    alreadyRegistered: "ನೀವು ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಿದ್ದೀರಿ! ಕೆಳಗೆ ನಿಮ್ಮ ಸ್ಕೋರ್ ನೋಡಿ.",
    required: "ಈ ಕ್ಷೇತ್ರ ಅಗತ್ಯವಿದೆ",
  }
};



// ============================================================
// UTILITIES
// ============================================================
function generateReferralCode() {
  return "RW-" + Math.floor(1000 + Math.random() * 9000);
}

function segmentRider(data) {
  if (data.vehicleType === "Electric Two Wheeler") return "EV Rider";
  if (!data.accidentalIns && !data.healthIns) return "Insurance Lead";
  if (data.evInterest === "Open to EV" || data.evInterest === "Need More Information") return "Hot EV Lead";
  return "Retrofit Lead";
}

function getMilestones(count) {
  const milestones = [];
  if (count >= 10) milestones.push({ label: "10 Referrals", bonus: 100, achieved: true });
  if (count >= 25) milestones.push({ label: "25 Referrals", bonus: 300, achieved: true });
  if (count >= 50) milestones.push({ label: "50 Referrals", bonus: 500, achieved: true });
  if (count < 10) milestones.push({ label: "10 Referrals", bonus: 100, achieved: false, remaining: 10 - count });
  if (count >= 10 && count < 25) milestones.push({ label: "25 Referrals", bonus: 300, achieved: false, remaining: 25 - count });
  if (count >= 25 && count < 50) milestones.push({ label: "50 Referrals", bonus: 500, achieved: false, remaining: 50 - count });
  return milestones;
}

function exportCSV(riders) {
  const headers = ["ID","Name","Phone","City","Platform","Vehicle","EV Interest","Segment","Points","Referrals","Date"];
  const rows = riders.map(r => [r.id,r.name,r.phone,r.city,r.platform,r.vehicle_type,r.evInterest,r.rider_segment,r.total_points,r.referral_count,r.created_at]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "riders.csv"; a.click();
}

// ============================================================
// CITY → LANGUAGE MAP
// ============================================================
const cityLangMap = {
  "Bangalore": "kn", "Bengaluru": "kn", "Mysore": "kn", "Hubli": "kn",
  "Delhi": "hi", "Mumbai": "en", "Chennai": "en", "Hyderabad": "en",
  "Pune": "en", "Kolkata": "en", "Jaipur": "hi", "Lucknow": "hi",
  "Bhopal": "hi", "Indore": "hi", "Patna": "hi", "Kanpur": "hi"
};

// ============================================================
// COLORS / DESIGN TOKENS
// ============================================================
const SEGMENT_COLORS = {
  "Hot EV Lead":    { bg: "#fff7ed", border: "#f97316", text: "#9a3412", dot: "#f97316" },
  "Insurance Lead": { bg: "#eff6ff", border: "#3b82f6", text: "#1e3a8a", dot: "#3b82f6" },
  "Retrofit Lead":  { bg: "#f0fdf4", border: "#22c55e", text: "#14532d", dot: "#22c55e" },
  "EV Rider":       { bg: "#faf5ff", border: "#a855f7", text: "#581c87", dot: "#a855f7" },
};

// ============================================================
// MINI COMPONENTS
// ============================================================
function SegmentBadge({ segment }) {
  const c = SEGMENT_COLORS[segment] || { bg: "#f9fafb", border: "#d1d5db", text: "#374151", dot: "#9ca3af" };
  return (
    <span style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
      {segment}
    </span>
  );
}

function ProgressBar({ value, max, color = "#f97316" }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ background: "#f3f4f6", borderRadius: 99, height: 8, overflow: "hidden", flex: 1 }}>
      <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 99, transition: "width 0.6s ease" }} />
    </div>
  );
}

function StatCard({ label, value, icon, color = "#f97316", sub }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #f3f4f6", borderRadius: 16, padding: "16px 20px", minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#111", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Input({ label, type = "text", value, onChange, placeholder, required, error }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "11px 14px", border: `1.5px solid ${error ? "#ef4444" : "#e5e7eb"}`,
          borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box",
          background: "#fff", color: "#111", transition: "border-color 0.2s"
        }}
        onFocus={e => e.target.style.borderColor = error ? "#ef4444" : "#f97316"}
        onBlur={e => e.target.style.borderColor = error ? "#ef4444" : "#e5e7eb"}
      />
      {error && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function Select({ label, value, onChange, options, required, error }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "11px 14px", border: `1.5px solid ${error ? "#ef4444" : "#e5e7eb"}`,
          borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box",
          background: "#fff", color: value ? "#111" : "#9ca3af", cursor: "pointer"
        }}
      >
        <option value="">Select...</option>
        {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
      {error && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function MultiCheck({ label, options, selected, onChange }) {
  const toggle = (val) => {
    if (selected.includes(val)) onChange(selected.filter(v => v !== val));
    else onChange([...selected, val]);
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 8 }}>{label}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map(o => {
          const active = selected.includes(o);
          return (
            <button key={o} onClick={() => toggle(o)} style={{
              padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${active ? "#f97316" : "#e5e7eb"}`,
              background: active ? "#fff7ed" : "#fff", color: active ? "#c2410c" : "#374151",
              fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", transition: "all 0.15s"
            }}>{o}</button>
          );
        })}
      </div>
    </div>
  );
}

function YesNo({ label, value, onChange, t }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 8 }}>{label}</label>
      <div style={{ display: "flex", gap: 10 }}>
        {[true, false].map(v => (
          <button key={String(v)} onClick={() => onChange(v)} style={{
            flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${value === v ? "#f97316" : "#e5e7eb"}`,
            background: value === v ? "#fff7ed" : "#fff", color: value === v ? "#c2410c" : "#374151",
            fontSize: 14, fontWeight: value === v ? 700 : 400, cursor: "pointer", transition: "all 0.15s"
          }}>{v ? t.yes : t.no}</button>
        ))}
      </div>
    </div>
  );
}

function StepDots({ current, total }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 24 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? 24 : 8, height: 8, borderRadius: 99,
          background: i < current ? "#f97316" : i === current ? "#f97316" : "#e5e7eb",
          transition: "all 0.3s ease"
        }} />
      ))}
    </div>
  );
}

// ============================================================
// PAGE: LANDING
// ============================================================
function LandingPage({ lang, setLang, setPage, t }) {
  const stats = [
    { n: "12,000+", label: lang === "hi" ? "रजिस्टर्ड राइडर" : lang === "kn" ? "ನೋಂದಾಯಿತ ರೈಡರ್" : "Registered Riders" },
    { n: "₹500+", label: lang === "hi" ? "औसत मासिक बचत" : lang === "kn" ? "ಸರಾಸರಿ ಮಾಸಿಕ ಉಳಿತಾಯ" : "Avg Monthly Savings" },
    { n: "2,400+", label: lang === "hi" ? "EV में स्विच" : lang === "kn" ? "EV ಗೆ ಬದಲಾಗಿದ್ದಾರೆ" : "Switched to EV" },
  ];
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #fff7ed 0%, #fff 40%)" }}>
      {/* Header */}
      <div style={{ background: "#f97316", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}>🏍️ RWRN</div>
          <div style={{ color: "#fed7aa", fontSize: 11 }}>Road Warrior Network</div>
        </div>
        <select value={lang} onChange={e => setLang(e.target.value)} style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: 8, padding: "5px 10px", fontSize: 13, cursor: "pointer", outline: "none" }}>
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="kn">ಕನ್ನಡ</option>
        </select>
      </div>

      {/* Hero */}
      <div style={{ padding: "40px 24px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🏍️</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111", lineHeight: 1.2, margin: "0 0 12px" }}>
          {t.appName}
        </h1>
        <p style={{ fontSize: 16, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.5 }}>{t.tagline}</p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 32 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid #f3f4f6", padding: "14px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#f97316" }}>{s.n}</div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3, lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <button onClick={() => setPage("survey")} style={{
          width: "100%", background: "#f97316", color: "#fff", border: "none",
          borderRadius: 14, padding: "16px", fontSize: 17, fontWeight: 700, cursor: "pointer",
          boxShadow: "0 4px 24px rgba(249,115,22,0.35)", marginBottom: 12, transition: "transform 0.1s"
        }} onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"} onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
          🚀 {t.startSurvey}
        </button>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setPage("score")} style={{ flex: 1, background: "#fff", color: "#f97316", border: "1.5px solid #f97316", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            🏆 {t.checkScore}
          </button>
          <button onClick={() => setPage("admin")} style={{ flex: 1, background: "#fff", color: "#374151", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            📊 {t.adminDash}
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "0 20px 32px" }}>
        {[
          { icon: "💰", title: lang === "hi" ? "रिवॉर्ड कमाएं" : lang === "kn" ? "ರಿವಾರ್ಡ್ ಗಳಿಸಿ" : "Earn Rewards", desc: lang === "hi" ? "हर रेफरल पर +5 पॉइंट" : lang === "kn" ? "ಪ್ರತಿ ರೆಫರಲ್‌ಗೆ +5 ಪಾಯಿಂಟ್" : "+5 points per referral" },
          { icon: "⚡", title: lang === "hi" ? "EV ऑफर" : lang === "kn" ? "EV ಆಫರ್" : "EV Offers", desc: lang === "hi" ? "विशेष EV रेंटल ऑफर" : lang === "kn" ? "ವಿಶೇಷ EV ಬಾಡಿಗೆ ಆಫರ್" : "Exclusive EV rental deals" },
          { icon: "🛡️", title: lang === "hi" ? "बीमा सुरक्षा" : lang === "kn" ? "ವಿಮೆ ರಕ್ಷಣೆ" : "Insurance Cover", desc: lang === "hi" ? "सस्ता दुर्घटना बीमा" : lang === "kn" ? "ಅಗ್ಗದ ಅಪಘಾತ ವಿಮೆ" : "Affordable accident cover" },
        ].map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#fff", borderRadius: 14, border: "1px solid #f3f4f6", padding: "16px", marginBottom: 10 }}>
            <div style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PAGE: SURVEY FORM
// ============================================================
const PLATFORMS = ["Swiggy", "Zomato", "Blinkit", "Porter", "Dunzo", "Other"];
const VEHICLE_TYPES = ["Petrol Two Wheeler", "Diesel Two Wheeler", "Electric Two Wheeler", "Other"];
const FUELING_METHODS = ["Petrol Pump", "Home Charging", "Battery Swapping", "Other"];
const EV_INTEREST = ["Open to EV", "Not Interested", "Already on EV", "Need More Information"];
const GENERAL_CHALLENGES = ["High Fuel Cost", "Frequent Breakdown", "No Nearby Charging Station", "Battery Range Anxiety", "Repair Costs", "Long Refueling Time", "Other"];
const EV_CHALLENGES = ["Battery drains too fast", "Swapping station too far", "Long charging time", "Service centre not nearby", "Vehicle not powerful enough", "Other"];
const PETROL_CHALLENGES = ["Fuel price too high", "Engine issues", "Pollution fine risk", "High servicing cost", "Other"];
const SWITCH_MOTIVATORS = ["Lower Rental Cost", "Better Battery Range", "Nearby Swap Stations", "Income Guarantee", "Employer Subsidy", "Other"];
const INTERESTED_SERVICES = ["EV Rental Offer", "Insurance Quote", "Retrofit Information", "All of Above", "None"];

const CITIES = ["Bangalore","Bengaluru","Mumbai","Delhi","Chennai","Hyderabad","Pune","Kolkata","Jaipur","Lucknow","Indore","Bhopal","Mysore","Hubli","Patna","Surat","Ahmedabad","Nagpur"];

function SurveyPage({ lang, setPage, t }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [existingRider, setExistingRider] = useState(null);
  const [newRider, setNewRider] = useState(null);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    name: "", phone: "", email: "", city: "", platform: "", experience: "",
    vehicleType: "", vehicleModel: "", fuelingMethod: "", weeklyCost: "", maintenanceCost: "",
    generalChallenges: [], evChallenges: [], petrolChallenges: [],
    accidentalIns: null, healthIns: null, accidentExpense: null,
    evInterest: "", switchMotivators: [], interestedServices: [],
    referredBy: null, referralCode: ""
  });

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (k === "city" && cityLangMap[v]) {
      // auto language — but we don't call setLang here to avoid prop drilling
    }
    if (errors[k]) setErrors(e => ({ ...e, [k]: null }));
  };

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = t.required;
      if (!form.phone.trim() || form.phone.length < 10) e.phone = t.required;
      if (!form.city) e.city = t.required;
      if (!form.platform) e.platform = t.required;
      if (!form.experience) e.experience = t.required;
    }
    if (step === 1) {
      if (!form.vehicleType) e.vehicleType = t.required;
      if (!form.fuelingMethod) e.fuelingMethod = t.required;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        city: form.city,
        language: lang,

        platform: form.platform,
        experience_years: parseInt(form.experience) || 0,

        vehicle_type: form.vehicleType,
        vehicle_model: form.vehicleModel,

        fueling_method: form.fuelingMethod,
        weekly_cost: parseInt(form.weeklyCost) || 0,
        maintenance_cost: parseInt(form.maintenanceCost) || 0,

        general_challenges: form.generalChallenges,
        ev_challenges: form.evChallenges,
        petrol_challenges: form.petrolChallenges,

        accidental_insurance: form.accidentalIns === true,
        health_insurance: form.healthIns === true,
        accident_expense: form.accidentExpense === true,

        ev_interest: form.evInterest,
        switch_motivators: form.switchMotivators,
        interested_services: form.interestedServices,

        referral_code:
          form.referredBy === true
            ? form.referralCode
            : null
      };

    const result = await registerRider(payload);

    console.log("Registration API Response:", result);

    if (result.error === "already_registered") {
      setExistingRider(result.rider);
      setSubmitted(true);
      return;
    }

    if (!result.rider) {
      console.error("No rider returned:", result);
      alert("Registration failed");
      return;
    }

    setNewRider(result.rider);
    try {
      await emailjs.send(
        "service_hdapbyv",
        "template_t4miotd",
        {
          name: result.rider.name,
          referral_code: result.rider.referral_code,
          email: result.rider.email
        },
        "E4w_0PxfxIA8dghv6"
      );

      console.log("Email sent successfully");
    } catch (error) {
      console.error("Email send failed:", error);
    }
    setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  const STEPS = [t.sectionA, t.sectionB, t.sectionC, t.sectionD, t.sectionE, t.sectionF];

  if (submitted) {
    const rider = existingRider || newRider;
    return (
      <div style={{ minHeight: "100vh", background: "#fff7ed", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#f97316", padding: "14px 20px" }}>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>←</button>
        </div>
        <div style={{ flex: 1, padding: "40px 24px", textAlign: "center" }}>
          {existingRider ? (
            <>
              <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111", marginBottom: 8 }}>{t.alreadyRegistered}</h2>
            </>
          ) : (
            <>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 8 }}>{t.successTitle}</h2>
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #fed7aa", padding: "16px", display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <span style={{ fontSize: 24 }}>⭐</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#c2410c" }}>{t.successPoints}</span>
              </div>
            </>
          )}

          {/* Referral Card */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #fed7aa", padding: "24px", marginBottom: 24, boxShadow: "0 4px 24px rgba(249,115,22,0.1)" }}>
            <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8, fontWeight: 500 }}>{t.yourCode}</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#f97316", letterSpacing: 3, fontFamily: "monospace", marginBottom: 16 }}>
              {rider.referral_code}
            </div>
            <img
              src={rider.qr_code_url}
              alt="Referral QR Code"
              style={{
                width: "200px",
                height: "200px",
                margin: "16px auto",
                display: "block",
                border: "1px solid #fed7aa",
                borderRadius: "12px",
                padding: "8px",
                background: "#fff"
              }}
            />
            <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>{t.shareMsg}</div>
            <button onClick={() => { navigator.clipboard?.writeText(rider.referral_code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              style={{ width: "100%", background: copied ? "#22c55e" : "#f97316", color: "#fff", border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "background 0.3s" }}>
              {copied ? `✓ ${t.copied}` : `📋 ${t.copyCode}`}
            </button>
          </div>

          {/* Score Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f3f4f6", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#f97316" }}>{rider.total_points}</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>{t.points}</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f3f4f6", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#7c3aed" }}>{rider.referral_count}</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>{t.referrals}</div>
            </div>
          </div>

          <SegmentBadge segment={rider.rider_segment} />

          <button onClick={() => setPage("home")} style={{ marginTop: 24, width: "100%", background: "#fff", color: "#f97316", border: "1.5px solid #f97316", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Header */}
      <div style={{ background: "#f97316", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => step === 0 ? setPage("home") : setStep(s => s - 1)} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{STEPS[step]}</div>
          <div style={{ color: "#fed7aa", fontSize: 12 }}>{t.step} {step + 1} {t.of} {STEPS.length}</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ background: "#fff7ed", padding: "12px 20px" }}>
        <ProgressBar value={step + 1} max={STEPS.length} />
      </div>

      <div style={{ padding: "24px 20px 100px" }}>
        <StepDots current={step} total={STEPS.length} />

        {/* STEP 0: Basic Profile */}
        {step === 0 && (
          <>
            <Input label={t.fullName} value={form.name} onChange={v => set("name", v)} placeholder="e.g. Rahul Kumar" required error={errors.name} />
            <Input label={t.whatsapp} type="tel" value={form.phone} onChange={v => set("phone", v)} placeholder="10-digit number" required error={errors.phone} />
            <Input
              label={t.email}
              type="email"
              value={form.email}
              onChange={(v) => set("email", v)}
              placeholder="Enter Email"
            />
            <Select label={t.city} value={form.city} onChange={v => set("city", v)} options={CITIES} required error={errors.city} />
            <Select label={t.platform} value={form.platform} onChange={v => set("platform", v)} options={PLATFORMS} required error={errors.platform} />
            <Input label={t.experience} type="number" value={form.experience} onChange={v => set("experience", v)} placeholder="e.g. 3" required error={errors.experience} />
          </>
        )}

        {/* STEP 1: Vehicle */}
        {step === 1 && (
          <>
            <Select label={t.vehicleType} value={form.vehicleType} onChange={v => set("vehicleType", v)} options={VEHICLE_TYPES} required error={errors.vehicleType} />
            <Input label={t.vehicleModel} value={form.vehicleModel} onChange={v => set("vehicleModel", v)} placeholder="e.g. Honda Activa, Ola S1" />
            <Select label={t.fuelingMethod} value={form.fuelingMethod} onChange={v => set("fuelingMethod", v)} options={FUELING_METHODS} required error={errors.fuelingMethod} />
            <Input label={t.weeklyCost} type="number" value={form.weeklyCost} onChange={v => set("weeklyCost", v)} placeholder="e.g. 800" />
            <Input label={t.maintenanceCost} type="number" value={form.maintenanceCost} onChange={v => set("maintenanceCost", v)} placeholder="e.g. 1200" />
          </>
        )}

        {/* STEP 2: Challenges */}
        {step === 2 && (
          <>
            <MultiCheck label={t.generalChallenges} options={GENERAL_CHALLENGES} selected={form.generalChallenges} onChange={v => set("generalChallenges", v)} />
            {(form.vehicleType.includes("Electric")) && (
              <MultiCheck label="EV Specific Challenges" options={EV_CHALLENGES} selected={form.evChallenges} onChange={v => set("evChallenges", v)} />
            )}
            {(form.vehicleType.includes("Petrol") || form.vehicleType.includes("Diesel")) && (
              <MultiCheck label="Petrol/Diesel Specific Challenges" options={PETROL_CHALLENGES} selected={form.petrolChallenges} onChange={v => set("petrolChallenges", v)} />
            )}
          </>
        )}

        {/* STEP 3: Insurance */}
        {step === 3 && (
          <>
            <YesNo label={t.accidentalIns} value={form.accidentalIns} onChange={v => set("accidentalIns", v)} t={t} />
            <YesNo label={t.healthIns} value={form.healthIns} onChange={v => set("healthIns", v)} t={t} />
            <YesNo label={t.accidentExpense} value={form.accidentExpense} onChange={v => set("accidentExpense", v)} t={t} />
          </>
        )}

        {/* STEP 4: Openness to EV */}
        {step === 4 && (
          <>
            <Select label={t.evInterest} value={form.evInterest} onChange={v => set("evInterest", v)} options={EV_INTEREST} />
            <MultiCheck label={t.switchMotivators} options={SWITCH_MOTIVATORS} selected={form.switchMotivators} onChange={v => set("switchMotivators", v)} />
            <MultiCheck label={t.interestedServices} options={INTERESTED_SERVICES} selected={form.interestedServices} onChange={v => set("interestedServices", v)} />
          </>
        )}

        {/* STEP 5: Referral */}
        {step === 5 && (
          <>
            <YesNo label={t.referredBy} value={form.referredBy} onChange={v => set("referredBy", v)} t={t} />
            {form.referredBy === true && (
              <Input label={t.referralCode} value={form.referralCode} onChange={v => set("referralCode", v.toUpperCase())} placeholder="e.g. RW-4821" />
            )}

            {/* Points preview */}
            <div style={{ background: "#fff7ed", borderRadius: 14, border: "1px solid #fed7aa", padding: "16px", marginTop: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#c2410c", marginBottom: 10 }}>🎁 Referral Rewards</div>
              {[["Register", "+10 pts"], ["Each Referral", "+5 pts"], ["10 Referrals", "+100 pts"], ["25 Referrals", "+300 pts"], ["50 Referrals", "+500 pts"]].map(([a, p]) => (
                <div key={a} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", color: "#374151" }}>
                  <span>{a}</span><span style={{ fontWeight: 700, color: "#f97316" }}>{p}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom CTA */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #f3f4f6", padding: "16px 20px", maxWidth: 480, margin: "0 auto" }}>
        <button onClick={step < 5 ? handleNext : handleSubmit} style={{
          width: "100%", background: "#f97316", color: "#fff", border: "none",
          borderRadius: 14, padding: "16px", fontSize: 17, fontWeight: 700,
          cursor: "pointer", boxShadow: "0 4px 24px rgba(249,115,22,0.3)"
        }}>
          {step < 5 ? `${t.next} →` : `✓ ${t.submit}`}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: MY SCORE
// ============================================================
function ScorePage({ setPage, t }) {
  const [phone, setPhone] = useState("");
  const [rider, setRider] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const milestoneTargets = [10, 25, 50];
  const milestoneBonuses = [100, 300, 500];

  const check = async () => {
    try {
      const result = await getScore(phone.trim());

      if (result.error) {
        setRider(null);
        setNotFound(true);
        return;
      }

      setRider(result);
      setNotFound(false);
    } catch (err) {
      console.error(err);
      setNotFound(true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <div style={{ background: "#f97316", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>←</button>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 17 }}>🏆 {t.scoreTitle}</div>
      </div>

      <div style={{ padding: "32px 20px" }}>
        <div style={{ background: "#fff7ed", borderRadius: 16, border: "1px solid #fed7aa", padding: "20px", marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 8 }}>{t.enterPhone}</label>
          <div style={{ display: "flex", gap: 10 }}>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit number" type="tel"
              style={{ flex: 1, padding: "12px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box" }}
              onKeyDown={e => e.key === "Enter" && check()}
            />
            <button onClick={check} style={{ background: "#f97316", color: "#fff", border: "none", borderRadius: 10, padding: "12px 18px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              {t.checkBtn}
            </button>
          </div>
        </div>

        {notFound && <div style={{ textAlign: "center", color: "#ef4444", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "16px" }}>Phone not registered. Please sign up first.</div>}

        {rider && (
          <div>
            {/* Profile card */}
            <div style={{ background: "#fff", border: "1px solid #f3f4f6", borderRadius: 20, padding: "20px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#fff7ed", border: "2px solid #f97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                  {rider.vehicle_type?.includes("Electric") ? "⚡" : "🏍️"}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: "#111" }}>{rider.name}</div>
                  <div style={{ fontSize: 13, color: "#9ca3af" }}>{rider.city} · {rider.platform}</div>
                </div>
              </div>
              <SegmentBadge segment={rider.rider_segment} />
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ background: "#fff7ed", borderRadius: 16, padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: "#f97316" }}>{rider.total_points}</div>
                <div style={{ fontSize: 13, color: "#9a3412", fontWeight: 600 }}>⭐ {t.points}</div>
              </div>
              <div style={{ background: "#faf5ff", borderRadius: 16, padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: "#7c3aed" }}>{rider.referral_count}</div>
                <div style={{ fontSize: 13, color: "#581c87", fontWeight: 600 }}>👥 {t.referrals}</div>
              </div>
            </div>

            {/* Referral Code */}
            <div style={{ background: "#fff", border: "2px dashed #f97316", borderRadius: 16, padding: "20px", textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>Your Referral Code</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#f97316", fontFamily: "monospace", letterSpacing: 3 }}>{rider.referral_code}</div>
            </div>

            {/* Milestones */}
            <div style={{ background: "#fff", border: "1px solid #f3f4f6", borderRadius: 16, padding: "20px" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#111", marginBottom: 14 }}>🎯 {t.milestones}</div>
              {milestoneTargets.map((target, i) => {
                const achieved = rider.referral_count >= target;
                const pct = Math.min(100, Math.round((rider.referral_count / target) * 100));
                return (
                  <div key={target} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, color: achieved ? "#22c55e" : "#374151" }}>
                        {achieved ? "✓ " : ""}{target} Referrals
                      </span>
                      <span style={{ fontWeight: 700, color: "#f97316" }}>+{milestoneBonuses[i]} pts</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <ProgressBar value={rider.referral_count} max={target} color={achieved ? "#22c55e" : "#f97316"} />
                      <span style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap" }}>{rider.referral_count}/{target}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// PAGE: ADMIN DASHBOARD
// ============================================================
function AdminDashboard({ setPage, t }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const [search, setSearch] = useState("");
  const [filterSegment, setFilterSegment] = useState("All");
  const [activeTab, setActiveTab] = useState("overview");

  const [riders, setRiders] = useState([]);

  // Delete feature state
  const [confirmDelete, setConfirmDelete] = useState(null); // rider object | null
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success"|"error", msg } | null

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:4000";

  // Fetch only active riders using admin password header
  const fetchRiders = async (password = adminPassword) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/riders`, {
        headers: { "x-admin-password": password }
      });
      const data = await res.json();
      if (Array.isArray(data)) setRiders(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authenticated) fetchRiders();
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#fff7ed"
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "16px",
            width: "320px"
          }}
        >
          <h2>Admin Login</h2>

          <input
            type="password"
            placeholder="Enter Password"
            value={adminPassword}
            onChange={(e) =>
              setAdminPassword(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "12px"
            }}
          />

          <button
            onClick={async () => {
              try {
                const response = await fetch(
                  `${API_URL}/api/admin/login`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type":
                        "application/json"
                    },
                    body: JSON.stringify({
                      password: adminPassword
                    })
                  }
                );

                const data =
                  await response.json();

                if (data.success) {
                  setAuthenticated(true);
                } else {
                  alert("Wrong Password");
                }
              } catch (err) {
                alert("Login Failed");
              }
            }}
            style={{
              width: "100%",
              marginTop: "12px",
              padding: "12px",
              background: "#f97316",
              color: "white",
              border: "none",
              borderRadius: "8px"
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // ── Soft-delete handler ───────────────────────────────────
  const handleDeleteConfirmed = async () => {
    if (!confirmDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/riders/${confirmDelete.id}`, {
        method: "DELETE",
        headers: { "x-admin-password": adminPassword }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRiders(prev => prev.filter(r => r.id !== confirmDelete.id));
        showToast("success", `✅ ${confirmDelete.name} has been removed.`);
      } else {
        showToast("error", `❌ ${data.error || "Delete failed. Please try again."}`);
      }
    } catch (err) {
      showToast("error", "❌ Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
      setConfirmDelete(null);
    }
  };

  // const riders = DB.riders;
  const filtered = riders.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search);
    const matchSeg = filterSegment === "All" || r.rider_segment === filterSegment;
    return matchSearch && matchSeg;
  });

  const cityData = Object.values(
    riders.reduce((acc, rider) => {
      acc[rider.city] = acc[rider.city] || {
        city: rider.city,
        count: 0
      };

      acc[rider.city].count++;

      return acc;
    }, {})
  );

  const segmentData = Object.values(
    riders.reduce((acc, rider) => {
      acc[rider.rider_segment] =
        acc[rider.rider_segment] || {
          name: rider.rider_segment,
          value: 0
        };

      acc[rider.rider_segment].value++;

      return acc;
    }, {})
  );

  // Metrics
  const total = riders.length;
  const hotLeads = riders.filter(r => r.rider_segment === "Hot EV Lead").length;
  const insLeads = riders.filter(r => r.rider_segment === "Insurance Lead").length;
  const retLeads = riders.filter(r => r.rider_segment === "Retrofit Lead").length;
  const evRiders = riders.filter(r => r.rider_segment === "EV Rider").length;

  // Vehicle breakdown
  const vTypes = {};
  riders.forEach(r => { vTypes[r.vehicle_type] = (vTypes[r.vehicle_type] || 0) + 1; });
  const vData = Object.entries(vTypes).sort((a, b) => b[1] - a[1]);

  // City breakdown
  const cTypes = {};
  riders.forEach(r => { cTypes[r.city] = (cTypes[r.city] || 0) + 1; });
  const cData = Object.entries(cTypes).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Platform breakdown
  const pTypes = {};
  riders.forEach(r => { pTypes[r.platform] = (pTypes[r.platform] || 0) + 1; });
  const pData = Object.entries(pTypes).sort((a, b) => b[1] - a[1]);

  // Top referrers
  const topRefs = [...riders].sort((a, b) => b.referral_count - a.referral_count).slice(0, 5);

  const VCOLORS = { "Petrol Two Wheeler": "#f97316", "Electric Two Wheeler": "#7c3aed", "Diesel Two Wheeler": "#3b82f6", "Other": "#6b7280" };

  // Mini bar chart
  function MiniBar({ data, colors }) {
    const max = Math.max(...data.map(d => d[1]), 1);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.map(([label, val]) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: "#374151", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "65%" }}>{label}</span>
              <span style={{ color: "#9ca3af", fontWeight: 600 }}>{val}</span>
            </div>
            <div style={{ background: "#f3f4f6", borderRadius: 99, height: 6 }}>
              <div style={{ width: `${Math.round((val / max) * 100)}%`, background: colors?.[label] || "#f97316", height: "100%", borderRadius: 99, transition: "width 0.5s" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const TABS = ["overview", "riders", "leads"];

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>

      {/* ── Toast notification ── */}
      {toast && (
        <div style={{
          position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
          zIndex: 9999, background: toast.type === "success" ? "#ecfdf5" : "#fef2f2",
          border: `1px solid ${toast.type === "success" ? "#6ee7b7" : "#fca5a5"}`,
          color: toast.type === "success" ? "#065f46" : "#991b1b",
          borderRadius: 12, padding: "12px 20px", fontSize: 14, fontWeight: 600,
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)", maxWidth: 360, textAlign: "center"
        }}>
          {toast.msg}
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {confirmDelete && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9000, padding: "0 20px"
        }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", maxWidth: 360, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111", margin: "0 0 8px" }}>Delete Rider?</h3>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 6px", lineHeight: 1.5 }}>
              Are you sure you want to delete this rider?
            </p>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#111", margin: "0 0 20px" }}>
              {confirmDelete.name} · {confirmDelete.phone}
            </p>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 24px", lineHeight: 1.5 }}>
              This rider will be permanently deleted from the database.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={deleteLoading}
                style={{ flex: 1, padding: "12px", background: "#f9fafb", border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#374151" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                disabled={deleteLoading}
                style={{ flex: 1, padding: "12px", background: deleteLoading ? "#fca5a5" : "#ef4444", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: deleteLoading ? "not-allowed" : "pointer", color: "#fff" }}
              >
                {deleteLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: "#111", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}>←</button>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>📊 {t.dashTitle}</div>
            <div style={{ color: "#9ca3af", fontSize: 11 }}>Admin View · {riders.length} riders</div>
          </div>
        </div>
        <button onClick={() => exportCSV(riders)} style={{ background: "#f97316", color: "#fff", border: "none", borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          ⬇ {t.exportCSV}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid #f3f4f6" }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: "12px 8px", background: "none", border: "none", borderBottom: `2px solid ${activeTab === tab ? "#f97316" : "transparent"}`,
            color: activeTab === tab ? "#f97316" : "#6b7280", fontSize: 13, fontWeight: activeTab === tab ? 700 : 500, cursor: "pointer", textTransform: "capitalize"
          }}>{tab}</button>
        ))}
      </div>

      <div style={{ padding: "16px 16px 80px" }}>

        {activeTab === "overview" && (
          <>
            {/* Stat Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <StatCard label={t.totalRiders} value={total} icon="👥" />
              <StatCard label="EV Riders" value={evRiders} icon="⚡" color="#7c3aed" />
              <StatCard label={t.hotLeads} value={hotLeads} icon="🔥" color="#ef4444" />
              <StatCard label={t.insuranceLeads} value={insLeads} icon="🛡️" color="#3b82f6" />
            </div>

            {/* Lead breakdown */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", padding: "16px", marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#111", marginBottom: 12 }}>Lead Segments</div>
              {[["Hot EV Lead", hotLeads, "#f97316"], ["EV Rider", evRiders, "#7c3aed"], ["Insurance Lead", insLeads, "#3b82f6"], ["Retrofit Lead", retLeads, "#22c55e"]].map(([label, val, color]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "#374151", flex: 1 }}>{label}</span>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>{val}</span>
                  <div style={{ width: 60 }}><ProgressBar value={val} max={total} color={color} /></div>
                </div>
              ))}
            </div>

            {/* Add Bar Chart */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid #f3f4f6",
                padding: "16px",
                marginBottom: 14
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#111",
                  marginBottom: 12
                }}
              >
                📊 Riders by City
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cityData}>
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Add Pie Chart */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid #f3f4f6",
                padding: "16px",
                marginBottom: 14
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#111",
                  marginBottom: 12
                }}
              >
                🥧 Rider Segments
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={segmentData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Vehicle Breakdown */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", padding: "16px", marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#111", marginBottom: 12 }}>🏍️ {t.vehicleBreakdown}</div>
              <MiniBar data={vData} colors={VCOLORS} />
            </div>

            {/* City Breakdown */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", padding: "16px", marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#111", marginBottom: 12 }}>🏙️ {t.cityBreakdown}</div>
              <MiniBar data={cData} />
            </div>

            {/* Platform Breakdown */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", padding: "16px", marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#111", marginBottom: 12 }}>📦 Platform Distribution</div>
              <MiniBar data={pData} />
            </div>

            {/* Top Referrers */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", padding: "16px" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#111", marginBottom: 12 }}>🏆 {t.topReferrers}</div>
              {topRefs.map((r, i) => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < topRefs.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: i === 0 ? "#fbbf24" : i === 1 ? "#d1d5db" : i === 2 ? "#f97316" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: i < 3 ? "#fff" : "#6b7280" }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{r.city} · {r.referral_code}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#f97316" }}>{r.total_points} pts</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{r.referral_count} refs</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "riders" && (
          <>
            {/* Search & Filter */}
            <div style={{ marginBottom: 12 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.searchPlaceholder}
                style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }} />
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                {["All", "Hot EV Lead", "EV Rider", "Insurance Lead", "Retrofit Lead"].map(seg => (
                  <button key={seg} onClick={() => setFilterSegment(seg)} style={{
                    padding: "6px 12px", borderRadius: 20, border: `1.5px solid ${filterSegment === seg ? "#f97316" : "#e5e7eb"}`,
                    background: filterSegment === seg ? "#fff7ed" : "#fff", color: filterSegment === seg ? "#c2410c" : "#374151",
                    fontSize: 12, fontWeight: filterSegment === seg ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0
                  }}>{seg}</button>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10 }}>{filtered.length} riders found</div>
            {filtered.map(r => (
              <div key={r.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #f3f4f6", padding: "14px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{r.phone} · {r.city}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <SegmentBadge segment={r.rider_segment} />
                    <button
                      onClick={() => setConfirmDelete(r)}
                      title="Delete rider"
                      style={{
                        background: "#fef2f2", border: "1.5px solid #fca5a5", color: "#dc2626",
                        borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700,
                        cursor: "pointer", flexShrink: 0
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#dc2626"; }}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6b7280" }}>
                  <span>🏍️ {r.vehicle_type?.split(" ")[0]}</span>
                  <span>📦 {r.platform}</span>
                  <span>⭐ {r.total_points} pts</span>
                  <span>👥 {r.referral_count}</span>
                </div>
                <div style={{ marginTop: 6, fontSize: 11, color: "#9ca3af" }}>Code: <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#f97316" }}>{r.referral_code}</span> · {r.created_at}</div>
              </div>
            ))}
          </>
        )}

        {activeTab === "leads" && (
          <>
            {["Hot EV Lead", "Insurance Lead", "Retrofit Lead"].map(seg => {
              const leads = riders.filter(r => r.rider_segment === seg);
              const c = SEGMENT_COLORS[seg];
              return (
                <div key={seg} style={{ background: "#fff", borderRadius: 16, border: `1.5px solid ${c.border}`, padding: "16px", marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: c.text }}>{seg}</div>
                    <div style={{ background: c.bg, color: c.text, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 700, border: `1px solid ${c.border}` }}>{leads.length} riders</div>
                  </div>
                  {leads.slice(0, 3).map(r => (
                    <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f9fafb" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#111" }}>{r.name}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>{r.city} · {r.platform}</div>
                      </div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{r.phone}</div>
                    </div>
                  ))}
                  {leads.length > 3 && <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 8, textAlign: "center" }}>+{leads.length - 3} more</div>}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  const [page, setPage] = useState("home");
  const [lang, setLang] = useState("en");

  const t = T[lang] || T.en;

  const handleLangChange = useCallback((l) => setLang(l), []);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", position: "relative" }}>
      {page === "home" && <LandingPage lang={lang} setLang={handleLangChange} setPage={setPage} t={t} />}
      {page === "survey" && <SurveyPage lang={lang} setPage={setPage} t={t} />}
      {page === "score" && <ScorePage setPage={setPage} t={t} />}
      {page === "admin" && <AdminDashboard setPage={setPage} t={t} />}
    </div>
  );
}
