'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
    { id: 'dashboard', icon: '⬡', label: 'DASHBOARD', path: '/dashboard' },
    { id: 'hierarchy', icon: '⌥', label: 'HIERARCHY', path: '/dashboard/hierarchy' },
    { id: 'members', icon: '◈', label: 'MEMBERS', path: '/dashboard/members' },
    { id: 'tokens', icon: '⚿', label: 'TOKENS', path: '/dashboard/tokens' },
];

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    // Compute active nav - exact match only, no default selection
    const activeNav = NAV.find(n => pathname === n.path)?.id || null;
    const [hoveredNav, setHoveredNav] = useState(null);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const styles = {
        layout: { display: 'flex', minHeight: '100vh' },
        sidebar: {
            width: 220,
            minWidth: 220,
            background: '#0d1f3c',
            borderRight: '1px solid #1e3a5f',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 0',
        },
        sidebarLogo: {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 20px 20px',
            borderBottom: '1px solid #1e3a5f',
            marginBottom: 16,
        },
        navItem: (isActive, isHovered) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: 12,
            color: '#7a9cc6',
            background: isActive ? 'rgba(255,204,0,0.08)' : (isHovered ? 'rgba(255,204,0,0.04)' : 'transparent'),
            borderLeft: isActive ? '2px solid #ffcc00' : '2px solid transparent',
            transition: 'background 0.2s, color 0.2s',
        }),
        main: { flex: 1, overflow: 'auto', background: '#0a1628' },
        topbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 28px',
            borderBottom: '3px solid #ffcc00',
            background: 'linear-gradient(to right, #0d1f3c 60%, #122a4d 60%)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
        },
        content: { padding: '28px' },
        avatar: {
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: '#ffcc00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            color: '#080b10',
        },
    };

    const getInitials = (name) => name?.slice(0, 2).toUpperCase() || 'U';

    return (
        <div style={styles.layout}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <div style={styles.sidebarLogo}>
                    <div
                        style={{
                            width: 100,
                            height: 100,
                            backgroundImage: "url('https://www.ntc.net.np/_nuxt/img/logo.6aa152d.png')",
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                        }}
                    />
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: '#ffcc00' }}>
                            USER MANAGEMENT
                        </div>
                        <div style={{ fontSize: 9, color: '#7a9cc6', letterSpacing: 2 }}>PORTAL</div>
                    </div>
                </div>

                {NAV.map((n) => (
                    <div
                        key={n.id + pathname}
                        style={styles.navItem(activeNav === n.id, hoveredNav === n.id)}
                        onClick={() => router.push(n.path)}
                        onMouseEnter={() => setHoveredNav(n.id)}
                        onMouseLeave={() => setHoveredNav(null)}
                    >
                        <span style={{ fontSize: 22, color: activeNav === n.id ? '#ffcc00' : (hoveredNav === n.id ? '#ffcc00' : '#7a9cc6') }}>{n.icon}</span>
                        <span style={{ color: '#7a9cc6' }}>{n.label}</span>
                    </div>
                ))}

                <div style={{ flex: 1 }} />

                {/* User info */}
                <div style={{ padding: '16px 20px', borderTop: '1px solid #1e3a5f' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={styles.avatar}>{getInitials(user?.username)}</div>
                        <div>
                            <div style={{ fontSize: 11, color: '#e8f0ff' }}>{user?.username}</div>
                            <div style={{ fontSize: 9, color: '#7a9cc6', letterSpacing: 1 }}>{user?.role}</div>
                        </div>
                    </div>
                    <div
                        style={{
                            marginTop: 12,
                            fontSize: 10,
                            color: '#ef4444',
                            cursor: 'pointer',
                            letterSpacing: 1,
                        }}
                        onClick={handleLogout}
                    >
                        → LOGOUT
                    </div>
                </div>
            </div>

            {/* Main */}
            <div style={styles.main}>
                <div style={styles.topbar}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#ffcc00' }}>
                            {NAV.find(n => n.id === activeNav)?.icon}
                        </span>
                        <span style={{ fontSize: 11, color: '#7a9cc6', letterSpacing: 2 }}>
                            {NAV.find(n => n.id === activeNav)?.label}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <span style={{ fontSize: 10, color: '#7a9cc6' }}>
                            domains: [{user?.domains?.join(', ')}]
                        </span>
                        <span
                            style={{
                                fontSize: 10,
                                padding: '3px 8px',
                                background: 'rgba(34,197,94,0.15)',
                                color: '#22c55e',
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
