import { S } from "../styles";

function TokensPage({ user }) {
  return (
    <div style={S.content}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
          Token Management
        </div>
        <div style={{ fontSize: 11, color: S.muted, letterSpacing: 1 }}>
          JWT access + refresh · SimpleJWT · rotation enabled
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 24,
        }}
      >
        {[
          {
            label: "ACCESS TOKEN",
            lifetime: "15 minutes",
            rotate: "—",
            blacklist: "—",
            color: S.accent,
          },
          {
            label: "REFRESH TOKEN",
            lifetime: "7 days",
            rotate: "Yes",
            blacklist: "After rotation",
            color: S.green,
          },
        ].map((t) => (
          <div key={t.label} style={{ ...S.treeCard, padding: "20px" }}>
            <div
              style={{
                fontSize: 10,
                color: t.color,
                letterSpacing: 2,
                marginBottom: 16,
              }}
            >
              {t.label}
            </div>
            {[
              ["LIFETIME", t.lifetime],
              ["ROTATE", t.rotate],
              ["BLACKLIST", t.blacklist],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "7px 0",
                  borderBottom: `1px solid ${S.faint}`,
                }}
              >
                <span style={{ fontSize: 10, color: S.muted }}>{k}</span>
                <span style={{ fontSize: 11 }}>{v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={S.sectionTitle}>SIMPLEJWT CONFIG (settings.py)</div>
      <div style={{ ...S.treeCard, padding: 0, overflow: "hidden" }}>
        <div style={S.codeBlock}>
          {`SIMPLE_JWT = {
  "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
  "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
  "ROTATE_REFRESH_TOKENS": True,
  "BLACKLIST_AFTER_ROTATION": True,
  "AUTH_HEADER_TYPES": ("Bearer",),
}

# Request header:
# Authorization: Bearer <access_token>

# domains[] injected into payload:
# token["domains"] = [1, 2]  ← scoped access`}
        </div>
      </div>
    </div>
  );
}

export default TokensPage;
