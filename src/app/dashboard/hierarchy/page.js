'use client';

import { useEffect, useState } from 'react';
import { SkeletonPage } from '../../../components/Skeleton';
import api from '../../../utils/api';

export default function HierarchyPage() {
    const [data, setData] = useState({
        domains: [],
        organizations: [],
        departments: [],
        wings: [],
        users: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHierarchy = async () => {
            try {
                const resData = await api.getHierarchyMembers();
                setData(resData);
            } catch (err) {
                console.error('Failed to load hierarchy', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHierarchy();
    }, []);

    if (loading) return <SkeletonPage type="hierarchy" />;

    const hasData =
        data.domains.length ||
        data.organizations.length ||
        data.departments.length ||
        data.wings.length ||
        data.users.length;

    if (!hasData) return <div style={{ padding: 28, color: '#7a9cc6' }}>No hierarchy assigned</div>;

    const styles = {
        padding: { padding: 28 },
        maxWidth: { maxWidth: 900 },
        pageTitle: { fontSize: 20, fontWeight: 700, color: '#ffcc00', marginBottom: 28, letterSpacing: -0.5 },
        levelStyle: { marginBottom: 24 },
        levelTitle: { fontSize: 12, color: '#7a9cc6', letterSpacing: 2, marginBottom: 12, textTransform: 'uppercase' },
        itemCard: { background: '#122a4d', border: '1px solid #1e3a5f', borderRadius: 8, padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 },
        itemIcon: { width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 },
        itemText: { fontSize: 14, color: '#e8f0ff', fontWeight: 500 },
        arrowContainer: { display: 'flex', alignItems: 'center', padding: '8px 0', marginLeft: 15 },
        arrowLine: { width: 2, height: 20, background: '#ffcc00' },
        arrowHead: { width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '8px solid #ffcc00', marginLeft: -5 },
    };

    const domainIcon = { ...styles.itemIcon, background: '#8b5cf620', color: '#8b5cf6' };
    const orgIcon = { ...styles.itemIcon, background: '#ffcc0020', color: '#ffcc00' };
    const deptIcon = { ...styles.itemIcon, background: '#f9731620', color: '#f97316' };
    const wingIcon = { ...styles.itemIcon, background: '#22c55e20', color: '#22c55e' };
    const userIcon = { ...styles.itemIcon, background: '#ef444420', color: '#ef4444' };

    const renderArrow = () => (
        <div style={styles.arrowContainer}>
            <div style={styles.arrowLine} />
            <div style={styles.arrowHead} />
        </div>
    );

    return (
        <div style={{ ...styles.padding, ...styles.maxWidth }}>
            <h2 style={styles.pageTitle}>◈ Organization Hierarchy</h2>

            {/* Domains */}
            {data.domains.length > 0 && (
                <div style={styles.levelStyle}>
                    <div style={styles.levelTitle}>⬡ Domains</div>
                    {data.domains.map((domain, idx) => (
                        <div key={idx} style={styles.itemCard}>
                            <div style={domainIcon}>⬡</div>
                            <span style={styles.itemText}>{domain}</span>
                        </div>
                    ))}
                    {data.organizations.length > 0 && renderArrow()}
                </div>
            )}

            {/* Organizations */}
            {data.organizations.length > 0 && (
                <div style={styles.levelStyle}>
                    <div style={styles.levelTitle}>⌥ Organizations</div>
                    {data.organizations.map((org, idx) => (
                        <div key={idx} style={styles.itemCard}>
                            <div style={orgIcon}>⌥</div>
                            <span style={styles.itemText}>{org}</span>
                        </div>
                    ))}
                    {data.departments.length > 0 && renderArrow()}
                </div>
            )}

            {/* Departments */}
            {data.departments.length > 0 && (
                <div style={styles.levelStyle}>
                    <div style={styles.levelTitle}>◈ Departments</div>
                    {data.departments.map((dept, idx) => (
                        <div key={idx} style={styles.itemCard}>
                            <div style={deptIcon}>◈</div>
                            <span style={styles.itemText}>{dept}</span>
                        </div>
                    ))}
                    {data.wings.length > 0 && renderArrow()}
                </div>
            )}

            {/* Wings */}
            {data.wings.length > 0 && (
                <div style={styles.levelStyle}>
                    <div style={styles.levelTitle}>⚿ Wings</div>
                    {data.wings.map((wing, idx) => (
                        <div key={idx} style={styles.itemCard}>
                            <div style={wingIcon}>⚿</div>
                            <span style={styles.itemText}>{wing}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Users at the bottom */}
            {data.users.length > 0 && (
                <div style={styles.levelStyle}>
                    {renderArrow()}
                    <div style={styles.levelTitle}>👥 Members</div>
                    {data.users.map((user, idx) => (
                        <div key={idx} style={styles.itemCard}>
                            <div style={userIcon}>👤</div>
                            <span style={styles.itemText}>{user.username || user.email}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
