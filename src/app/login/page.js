'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

    const handleLogin = async () => {
        if (!identifier || !password) {
            setError('All fields required');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, password }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || data.detail || 'Invalid credentials');
            }

            const data = await response.json();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);

            const payload = JSON.parse(atob(data.access.split('.')[1]));
            const userRole = data.memberships?.some(m => m.role.toLowerCase() === 'admin')
                ? 'Admin'
                : 'User';

            const userData = {
                id: payload.user_id,
                username: payload.username,
                email: payload.email || '',
                domains: payload.domains || [],
                role: userRole,
            };

            localStorage.setItem('user_data', JSON.stringify(userData));
            login(userData);

            setTimeout(() => {
                router.push('/dashboard');
            }, 1200);
        } catch (err) {
            setError(err.message || 'Invalid credentials');
            setLoading(false);
        }
    };

    const styles = {
        wrap: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: "url('https://wallpaperbat.com/img/165356343-telecom-background-vector-art-icon.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: 24,
        },
        card: {
            width: '100%',
            maxWidth: 400,
            background: '#0d1f3c',
            border: '1px solid #1e3a5f',
            borderRadius: 16,
            padding: '40px 36px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 32,
        },
        logoSquare: {
            width: 36,
            height: 36,
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid #3b82f6',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3b82f6',
            fontSize: 16,
            fontWeight: 700,
        },
        logoText: { fontSize: 14, fontWeight: 700, letterSpacing: 1, color: '#e8f0ff' },
        logoSub: { fontSize: 10, color: '#7a9cc6', letterSpacing: 2 },
        title: { fontSize: 22, fontWeight: 700, marginBottom: 6, letterSpacing: -0.5, color: '#e8f0ff' },
        sub: { fontSize: 11, color: '#7a9cc6', marginBottom: 28, letterSpacing: 1 },
        label: { fontSize: 10, color: '#7a9cc6', letterSpacing: 2, marginBottom: 6, display: 'block' },
        input: {
            width: '100%',
            background: '#122a4d',
            border: '1px solid #1e3a5f',
            borderRadius: 8,
            color: '#e8f0ff',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 13,
            padding: '11px 14px',
            outline: 'none',
            marginBottom: 16,
        },
        btn: {
            width: '100%',
            background: '#3b82f6',
            color: '#080b10',
            border: 'none',
            borderRadius: 8,
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: 13,
            padding: '12px 0',
            cursor: 'pointer',
            letterSpacing: 1,
            marginTop: 4,
        },
        error: { color: '#ef4444', fontSize: 11, marginBottom: 10, letterSpacing: 1 },
        link: { color: '#3b82f6', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' },
    };

    return (
        <div style={styles.wrap}>
            <div style={styles.card}>
                <div style={styles.logo}>
                    <div
                        style={{
                            ...styles.logoSquare,
                            backgroundImage: "url('https://www.ntc.net.np/_nuxt/img/logo.6aa152d.png')",
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            color: 'transparent',
                        }}
                    />
                    <div>
                        <div style={styles.logoText}>UMS PORTAL</div>
                        <div style={styles.logoSub}>USER MANAGEMENT SYSTEM</div>
                    </div>
                </div>

                <div style={styles.title}>Sign in</div>
                <div style={styles.sub}>MULTI-IDENTIFIER AUTH · JWT · RBAC</div>

                <label style={styles.label}>IDENTIFIER</label>
                <input
                    style={styles.input}
                    placeholder="username / email / phone"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />

                <label style={styles.label}>PASSWORD</label>
                <input
                    style={styles.input}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />

                {error && <div style={styles.error}>⚠ {error}</div>}

                <button style={styles.btn} onClick={handleLogin}>
                    {loading ? 'AUTHENTICATING...' : '→ SIGN IN'}
                </button>

                <div style={{ textAlign: 'center', marginTop: 10 }}>
                    <span style={{ color: '#7a9cc6', fontSize: 12 }}>
                        Don't have an account?{' '}
                        <span style={styles.link} onClick={() => router.push('/signup')}>
                            Sign up
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}
