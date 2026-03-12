'use client';

export default function TokensPage() {
    const styles = {
        padding: { padding: 28 },
        pageHeader: { marginBottom: 24 },
        pageTitle: { fontSize: 20, fontWeight: 700, color: '#ffcc00', marginBottom: 4 },
        pageSubtitle: { fontSize: 11, color: '#7a9cc6', letterSpacing: 1 },
        grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 },
        card: { background: '#122a4d', border: '1px solid #1e3a5f', borderRadius: 12, padding: 20 },
        cardLabel: { fontSize: 10, letterSpacing: 2, marginBottom: 16 },
        row: { display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #1e3a5f' },
        rowLabel: { fontSize: 10, color: '#7a9cc6' },
        rowValue: { fontSize: 11, color: '#e8f0ff' },
        sectionTitle: { fontSize: 10, color: '#7a9cc6', letterSpacing: 2, marginBottom: 16, marginTop: 32 },
        codeCard: { background: '#122a4d', border: '1px solid #1e3a5f', borderRadius: 12, overflow: 'hidden' },
        codeBlock: { background: '#0a1628', padding: '16px 20px', fontSize: 11, fontFamily: 'monospace', color: '#22c55e', overflowX: 'auto' },
    };

    const tokenConfigs = [
        { label: 'ACCESS TOKEN', lifetime: '15 minutes', rotate: '—', blacklist: '—', color: '#ffcc00' },
        { label: 'REFRESH TOKEN', lifetime: '7 days', rotate: 'Yes', blacklist: 'After rotation', color: '#22c55e' },
    ];

    return (
        <div style={styles.padding}>
            <div style={styles.pageHeader}>
                <div style={styles.pageTitle}>⚿ Token Management</div>
                <div style={styles.pageSubtitle}>JWT access + refresh · SimpleJWT · rotation enabled</div>
            </div>

            <div style={styles.grid}>
                {tokenConfigs.map((t) => (
                    <div key={t.label} style={styles.card}>
                        <div style={{ ...styles.cardLabel, color: t.color }}>{t.label}</div>
                        {[
                            ['LIFETIME', t.lifetime],
                            ['ROTATE', t.rotate],
                            ['BLACKLIST', t.blacklist],
                        ].map(([k, v]) => (
                            <div key={k} style={styles.row}>
                                <span style={styles.rowLabel}>{k}</span>
                                <span style={styles.rowValue}>{v}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div style={styles.sectionTitle}>SIMPLEJWT CONFIG (settings.py)</div>
            <div style={styles.codeCard}>
                <div style={styles.codeBlock}>
                    {`SIMPLE_JWT = {
  "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
  "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
  "ROTATE_REFRESH_TOKENS": True,
  "BLACKLIST_AFTER_ROTATION": True,
  "AUTH_HEADER_TYPES": ("Bearer",),
}`}
                </div>
            </div>
        </div>
    );
}
