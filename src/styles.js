// ─── COLOUR TOKENS ────────────────────────────────────────────────────────────
export const C = {
  bg: "#0a1628", // Darker blue-black background
  surface: "#0d1f3c", // Deep blue surface
  card: "#122a4d", // Slightly lighter blue card
  border: "#1e3a5f", // Blue-tinted border
  borderHover: "#2d5a8a",
  accent: "#3b82f6", // Blue (bluish)
  accentDim: "rgba(59,130,246,0.15)",
  accentDim2: "rgba(59,130,246,0.08)",
  green: "#22c55e", // Green (greenish)
  greenDim: "rgba(34,197,94,0.15)",
  orange: "#eab308", // Yellow/Gold (yellowish)
  orangeDim: "rgba(234,179,8,0.15)",
  red: "#ef4444",
  redDim: "rgba(239,68,68,0.15)",
  violet: "#8b5cf6",
  violetDim: "rgba(139,92,246,0.15)",
  text: "#e8f0ff", // Light blue-white text for better readability
  muted: "#7a9cc6", // Muted blue-gray
  faint: "#1a3352",
  // NTC colors
  ntcBlue: "#0057a3",
  ntcYellow: "#ffcc00",
};

export const TYPE_COLOR = {
  domain: { fg: C.violet, bg: C.violetDim, label: "DOMAIN" },
  organization: { fg: C.accent, bg: C.accentDim, label: "ORG" },
  department: { fg: C.orange, bg: C.orangeDim, label: "DEPT" },
  wing: { fg: C.green, bg: C.greenDim, label: "WING" },
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
export const S = {
  app: {
    minHeight: "100vh",
    background: C.bg,
    color: C.text,
    fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
    fontSize: 13,
  },
  // Login
  loginWrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: "url('https://wallpaperbat.com/img/165356343-telecom-background-vector-art-icon.jpg')",
    backgroundSize: "cover",       // optional: makes it cover the whole container
    backgroundPosition: "center",  // optional: centers the image
    backgroundRepeat: "no-repeat", // optional: prevents tiling
    padding: 24,
  },

  loginCard: {
    width: "100%",
    maxWidth: 400,
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    padding: "40px 36px",
    boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
  },
  loginLogo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 32,
  },
  logoSquare: {
    width: 36,
    height: 36,
    background: C.accentDim,
    border: `1px solid ${C.accent}`,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: C.accent,
    fontSize: 16,
    fontWeight: 700,
  },
  logoText: { fontSize: 14, fontWeight: 700, letterSpacing: 1, color: C.text },
  logoSub: { fontSize: 10, color: C.muted, letterSpacing: 2 },
  loginTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 6,
    letterSpacing: -0.5,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  loginSub: {
    fontSize: 11,
    color: C.muted,
    marginBottom: 28,
    letterSpacing: 1,
  },
  label: {
    fontSize: 10,
    color: C.muted,
    letterSpacing: 2,
    marginBottom: 6,
    display: "block",
  },
  input: {
    width: "100%",
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    color: C.text,
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 13,
    padding: "11px 14px",
    outline: "none",
    marginBottom: 16,
    transition: "border-color 0.2s",
  },
  btn: {
    width: "100%",
    background: C.accent,
    color: "#080b10",
    border: "none",
    borderRadius: 8,
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 700,
    fontSize: 13,
    padding: "12px 0",
    cursor: "pointer",
    letterSpacing: 1,
    marginTop: 4,
    transition: "opacity 0.2s",
  },
  identifierHint: {
    fontSize: 10,
    color: C.muted,
    marginBottom: 20,
    padding: "8px 12px",
    background: C.faint,
    borderRadius: 6,
    lineHeight: 1.8,
  },
  tokenBox: {
    marginTop: 20,
    padding: "10px 12px",
    background: C.faint,
    borderRadius: 8,
    fontSize: 10,
    color: C.green,
    lineHeight: 1.7,
    wordBreak: "break-all",
  },
  // Layout
  layout: { display: "flex", minHeight: "100vh" },
  sidebar: {
    width: 220,
    minWidth: 220,
    background: C.surface,
    borderRight: `1px solid ${C.border}`,
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
  },
  sidebarLogo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 20px 20px",
    borderBottom: `1px solid ${C.border}`,
    marginBottom: 16,
  },
  navItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: 12,
    color: active ? C.accent : C.muted,
    background: active ? C.accentDim2 : "transparent",
    borderLeft: active ? `2px solid ${C.accent}` : "2px solid transparent",
    transition: "all 0.15s",
    letterSpacing: 0.5,
  }),
  main: { flex: 1, overflow: "auto", background: C.bg },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 28px",
    borderBottom: `1px solid ${C.border}`,
    background: C.surface,
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  content: { padding: "28px" },
  // Cards
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
    marginBottom: 28,
  },
  statCard: (accent) => ({
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: "20px 22px",
    borderTop: `2px solid ${accent}`,
  }),
  statNum: { fontSize: 28, fontWeight: 700, lineHeight: 1 },
  statLabel: { fontSize: 10, color: C.muted, letterSpacing: 2, marginTop: 6 },
  // Section title
  sectionTitle: {
    fontSize: 11,
    color: C.muted,
    letterSpacing: 3,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  // Hierarchy
  treeCard: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    overflow: "hidden",
  },
  treeHeader: {
    padding: "16px 20px",
    borderBottom: `1px solid ${C.border}`,
    fontSize: 12,
    color: C.muted,
    letterSpacing: 2,
  },
  treeBody: { padding: "16px 12px" },
  nodeRow: (depth) => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 8px",
    paddingLeft: depth * 20 + 8,
    borderRadius: 7,
    cursor: "pointer",
    transition: "background 0.15s",
    marginBottom: 2,
  }),
  typeBadge: (type) => ({
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1.5,
    padding: "2px 7px",
    borderRadius: 4,
    background: TYPE_COLOR[type].bg,
    color: TYPE_COLOR[type].fg,
  }),
  // Members table
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    fontSize: 10,
    color: C.muted,
    letterSpacing: 2,
    textAlign: "left",
    padding: "10px 16px",
    borderBottom: `1px solid ${C.border}`,
    fontWeight: 600,
  },
  td: {
    padding: "12px 16px",
    borderBottom: `1px solid ${C.faint}`,
    fontSize: 12,
    color: C.text,
  },
  roleBadge: (role) => ({
    fontSize: 9,
    letterSpacing: 1,
    padding: "3px 8px",
    borderRadius: 4,
    fontWeight: 700,
    background: role === "Admin" ? C.orangeDim : C.accentDim,
    color: role === "Admin" ? C.orange : C.accent,
  }),
  statusDot: (s) => ({
    display: "inline-block",
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: s === "active" ? C.green : C.muted,
    marginRight: 6,
  }),
  // JWT info box
  jwtPanel: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: "20px 22px",
    marginBottom: 28,
  },
  codeBlock: {
    background: C.faint,
    borderRadius: 8,
    padding: "14px 16px",
    fontSize: 11,
    color: C.green,
    lineHeight: 1.9,
    overflowX: "auto",
    marginTop: 12,
  },
  // Tabs
  tabRow: { display: "flex", gap: 4, marginBottom: 20 },
  tab: (active) => ({
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 11,
    cursor: "pointer",
    letterSpacing: 1,
    background: active ? C.accentDim : "transparent",
    color: active ? C.accent : C.muted,
    border: `1px solid ${active ? C.accent : "transparent"}`,
    transition: "all 0.15s",
  }),
  // Add member btn
  addBtn: {
    background: C.accentDim,
    border: `1px solid ${C.accent}`,
    color: C.accent,
    borderRadius: 8,
    padding: "8px 16px",
    fontSize: 11,
    cursor: "pointer",
    letterSpacing: 1,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  // Section title with yellow accent
  sectionTitle: {
    fontSize: 11,
    color: C.accent,
    letterSpacing: 3,
    marginBottom: 16,
    textTransform: "uppercase",
    fontWeight: 600,
  },
  // Yellow accent for icons
  iconYellow: {
    color: C.accent,
  },
  // User avatar
  avatar: (color) => ({
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    color: "#080b10",
  }),
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export const avatarColors = [
  C.accent,
  C.green,
  C.orange,
  C.violet,
  "#f472b6",
  "#facc15",
];
export const getColor = (i) => avatarColors[i % avatarColors.length];
export const initials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export function TypeBadge({ type }) {
  return <span style={S.typeBadge(type)}>{TYPE_COLOR[type].label}</span>;
}
