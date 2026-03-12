import { C, S, initials } from "../styles";

function Layout({ children, user, activeNav, setActiveNav, onLogout }) {
    const NAV = [
        { id: "dashboard", icon: "⬡", label: "DASHBOARD" },
        { id: "hierarchy", icon: "⌥", label: "HIERARCHY" },
        { id: "members", icon: "◈", label: "MEMBERS" },
        { id: "tokens", icon: "⚿", label: "TOKENS" },
    ];

    return (
        <div style={{ ...S.app, ...S.layout }}>
            {/* Sidebar - restored original layout */}
            <div style={S.sidebar}>
                <div style={S.sidebarLogo}>
                    <div
                        style={{
                            width: "100px",
                            height: "100px",
                            backgroundImage: "url('https://www.ntc.net.np/_nuxt/img/logo.6aa152d.png')",
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                        }}
                    />
                    <div>
                        <div style={{ ...S.logoText, fontSize: 12, color: C.accent }}>USER MANAGEMENT</div>
                        <div style={{ ...S.logoSub, fontSize: 9 }}>PORTAL</div>
                    </div>
                </div>

                {NAV.map((n) => (
                    <div
                        key={n.id}
                        style={S.navItem(activeNav === n.id)}
                        onClick={() => setActiveNav(n.id)}
                    >
                        <span style={{ color: activeNav === n.id ? "#ffcc00" : C.muted, fontSize: 14 }}>{n.icon}</span>
                        <span>{n.label}</span>
                    </div>
                ))}

                <div style={{ flex: 1 }} />

                {/* User info */}
                <div
                    style={{ padding: "16px 20px", borderTop: `1px solid ${C.border}` }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ ...S.avatar("#ffcc00"), color: "#080b10" }}>
                            {initials(user?.username || "U")}
                        </div>
                        <div>
                            <div style={{ fontSize: 11, color: C.text }}>
                                {user?.username}
                            </div>
                            <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1 }}>
                                {user?.role}
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            marginTop: 12,
                            fontSize: 10,
                            color: C.red,
                            cursor: "pointer",
                            letterSpacing: 1,
                        }}
                        onClick={onLogout}
                    >
                        → LOGOUT
                    </div>
                </div>
            </div>

            {/* Main */}
            <div style={S.main}>
                {/* Top content bar with NTC-style yellow line */}
                <div style={{
                    ...S.topbar,
                    borderBottom: "3px solid #ffcc00",
                    background: `linear-gradient(to right, ${C.surface} 60%, ${C.card} 60%)`,
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#ffcc00" }}>
                            {NAV.find((n) => n.id === activeNav)?.icon}
                        </span>
                        <span style={{ fontSize: 11, color: C.muted, letterSpacing: 2 }}>
                            {NAV.find((n) => n.id === activeNav)?.label}
                        </span>
                    </div>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <span style={{ fontSize: 10, color: C.muted }}>
                            domains: [{user?.domains?.join(", ")}]
                        </span>
                        <span
                            style={{
                                fontSize: 10,
                                padding: "3px 8px",
                                background: C.greenDim,
                                color: C.green,
                                borderRadius: 4,
                                letterSpacing: 1,
                            }}
                        >
                            ● LIVE
                        </span>
                    </div>
                </div>

                {children}
            </div>
        </div>
    );
}

export default Layout;
