'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        domains: 0,
        organizations: 0,
        departments: 0,
        wings: 0,
        users: 0,
        tokens: 0,
    });
    const [data, setData] = useState({
        domains: [],
        organizations: [],
        departments: [],
        wings: [],
        users: [],
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const resData = await api.getHierarchyMembers();
                setStats({
                    domains: resData.domains.length,
                    organizations: resData.organizations.length,
                    departments: resData.departments.length,
                    wings: resData.wings.length,
                    users: resData.users.length,
                    tokens: 1,
                });
                setData({
                    domains: resData.domains || [],
                    organizations: resData.organizations || [],
                    departments: resData.departments || [],
                    wings: resData.wings || [],
                    users: resData.users || [],
                });
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            }
        };
        fetchStats();
    }, []);

    const overviewCards = [
        { label: 'TOTAL USERS', val: stats.users, accent: '#3b82f6' },
        { label: 'DOMAINS', val: stats.domains, accent: '#8b5cf6' },
        { label: 'ORGANIZATIONS', val: stats.organizations, accent: '#eab308' },
        { label: 'DEPARTMENTS', val: stats.departments, accent: '#22c55e' },
        { label: 'WINGS', val: stats.wings, accent: '#f472b6' },
        { label: 'ACTIVE TOKENS', val: stats.tokens, accent: '#facc15' },
    ].filter((s) => s.val > 0);

    const styles = {
        content: { padding: '28px' },
        titleBox: { marginBottom: 28 },
        title: { fontSize: 20, fontWeight: 700, marginBottom: 4, color: '#ffcc00' },
        subtitle: { fontSize: 11, color: '#7a9cc6', letterSpacing: 1 },
        statGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            marginBottom: 28,
        },
        statCard: (accent) => ({
            background: '#122a4d',
            border: '1px solid #1e3a5f',
            borderRadius: 12,
            padding: '20px 22px',
            borderTop: `2px solid ${accent}`,
        }),
        statNum: (accent) => ({ fontSize: 28, fontWeight: 700, lineHeight: 1, color: accent }),
        statLabel: { fontSize: 10, color: '#7a9cc6', letterSpacing: 2, marginTop: 6 },
        sectionTitle: { fontSize: 16, color: '#ffcc00', marginBottom: 16, letterSpacing: 1 },
    };

    return (
        <div style={styles.content}>
            <div style={styles.titleBox}>
                <div style={styles.title}>⬡ Overview</div>
                <div style={styles.subtitle}>
                    JWT domains: [{user?.domains?.join(', ')}] · Role: {user?.role}
                </div>
            </div>

            <div style={styles.statGrid}>
                {overviewCards.map((s) => (
                    <div key={s.label} style={styles.statCard(s.accent)}>
                        <div style={styles.statNum(s.accent)}>{s.val}</div>
                        <div style={styles.statLabel}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 32 }}>
                <h3 style={styles.sectionTitle}>◈ Hierarchy Details</h3>

                {data.domains.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                        <strong style={{ color: '#8b5cf6' }}>⬡ Domains:</strong>{' '}
                        <span style={{ color: '#e8f0ff' }}>{data.domains.join(', ')}</span>
                    </div>
                )}

                {data.organizations.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                        <strong style={{ color: '#3b82f6' }}>⌥ Organizations:</strong>{' '}
                        <span style={{ color: '#e8f0ff' }}>{data.organizations.join(', ')}</span>
                    </div>
                )}

                {data.departments.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                        <strong style={{ color: '#eab308' }}>◈ Departments:</strong>{' '}
                        <span style={{ color: '#e8f0ff' }}>{data.departments.join(', ')}</span>
                    </div>
                )}

                {data.wings.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                        <strong style={{ color: '#22c55e' }}>⚿ Wings:</strong>{' '}
                        <span style={{ color: '#e8f0ff' }}>{data.wings.join(', ')}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
