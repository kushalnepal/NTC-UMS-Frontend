'use client';


const skeletonStyles = {
    base: {
        background: 'linear-gradient(90deg, #1a3352 25%, #234567 50%, #1a3352 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: 4,
    },
    card: {
        background: '#122a4d',
        border: '1px solid #1e3a5f',
        borderRadius: 12,
        padding: '20px 22px',
    },
    text: {
        height: 14,
        marginTop: 6,
        width: '60%',
    },
};

// Add keyframe animation via style tag
const shimmerAnimation = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

export function SkeletonCard({ accent = '#3b82f6' }) {
    return (
        <>
            <style>{shimmerAnimation}</style>
            <div style={{ ...skeletonStyles.card, borderTop: `2px solid ${accent}` }}>
                <div style={{ ...skeletonStyles.base, height: 28, width: 60, marginBottom: 6 }} />
                <div style={{ ...skeletonStyles.base, ...skeletonStyles.text }} />
            </div>
        </>
    );
}

export function SkeletonTableRow({ columns = 5 }) {
    return (
        <>
            <style>{shimmerAnimation}</style>
            <tr style={{ borderBottom: '1px solid #1a3352' }}>
                {Array.from({ length: columns }).map((_, i) => (
                    <td key={i} style={{ padding: '12px 16px' }}>
                        <div style={{ ...skeletonStyles.base, height: 14, width: '80%' }} />
                    </td>
                ))}
            </tr>
        </>
    );
}

export function SkeletonTable({ rows = 5, columns = 5 }) {
    return (
        <>
            <style>{shimmerAnimation}</style>
            <div style={{ background: '#122a4d', border: '1px solid #1e3a5f', borderRadius: 12, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#1a3352' }}>
                            {Array.from({ length: columns }).map((_, i) => (
                                <th key={i} style={{ padding: '12px 16px', textAlign: 'left' }}>
                                    <div style={{ ...skeletonStyles.base, height: 10, width: 60 }} />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: rows }).map((_, i) => (
                            <SkeletonTableRow key={i} columns={columns} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export function SkeletonHierarchyItem() {
    return (
        <>
            <style>{shimmerAnimation}</style>
            <div style={{
                background: '#122a4d',
                border: '1px solid #1e3a5f',
                borderRadius: 8,
                padding: '12px 16px',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 12
            }}>
                <div style={{ ...skeletonStyles.base, width: 32, height: 32, borderRadius: 8 }} />
                <div style={{ ...skeletonStyles.base, height: 14, width: '60%' }} />
            </div>
        </>
    );
}

export function SkeletonHierarchy() {
    return (
        <>
            <style>{shimmerAnimation}</style>
            <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, color: '#7a9cc6', letterSpacing: 2, marginBottom: 12, textTransform: 'uppercase' }}>
                    <div style={{ ...skeletonStyles.base, height: 12, width: 80, marginBottom: 12 }} />
                </div>
                <SkeletonHierarchyItem />
                <SkeletonHierarchyItem />
            </div>
        </>
    );
}

export function SkeletonText({ lines = 3 }) {
    return (
        <>
            <style>{shimmerAnimation}</style>
            <div style={{ marginBottom: 8 }}>
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            ...skeletonStyles.base,
                            height: 14,
                            width: i === lines - 1 ? '60%' : '100%',
                            marginBottom: 8
                        }}
                    />
                ))}
            </div>
        </>
    );
}

export function SkeletonPage({ type = 'dashboard' }) {
    const styles = {
        content: { padding: 28 },
        titleBox: { marginBottom: 28 },
        title: { fontSize: 20, fontWeight: 700, marginBottom: 4, color: '#ffcc00' },
        statGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            marginBottom: 28,
        },
    };

    if (type === 'dashboard') {
        return (
            <>
                <style>{shimmerAnimation}</style>
                <div style={styles.content}>
                    <div style={styles.titleBox}>
                        <div style={{ ...skeletonStyles.base, height: 20, width: 150, marginBottom: 8 }} />
                        <div style={{ ...skeletonStyles.base, height: 11, width: 200 }} />
                    </div>
                    <div style={styles.statGrid}>
                        <SkeletonCard accent="#3b82f6" />
                        <SkeletonCard accent="#8b5cf6" />
                        <SkeletonCard accent="#eab308" />
                        <SkeletonCard accent="#22c55e" />
                    </div>
                    <div style={{ marginTop: 32 }}>
                        <div style={{ fontSize: 16, color: '#ffcc00', marginBottom: 16, letterSpacing: 1 }}>
                            <div style={{ ...skeletonStyles.base, height: 16, width: 150, marginBottom: 16 }} />
                        </div>
                        <SkeletonText lines={4} />
                    </div>
                </div>
            </>
        );
    }

    if (type === 'members') {
        return (
            <>
                <style>{shimmerAnimation}</style>
                <div style={styles.content}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <div style={{ ...skeletonStyles.base, height: 20, width: 150 }} />
                        <div style={{ ...skeletonStyles.base, height: 36, width: 100, borderRadius: 8 }} />
                    </div>
                    <SkeletonTable rows={6} columns={6} />
                </div>
            </>
        );
    }

    if (type === 'hierarchy') {
        return (
            <>
                <style>{shimmerAnimation}</style>
                <div style={styles.content}>
                    <div style={{ ...skeletonStyles.base, height: 20, width: 200, marginBottom: 28 }} />
                    <SkeletonHierarchy />
                    <SkeletonHierarchy />
                    <SkeletonHierarchy />
                </div>
            </>
        );
    }

    return null;
}
