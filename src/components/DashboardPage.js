import { useEffect, useState } from "react";
import { C, S } from "../styles";

function DashboardPage({ user }) {
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
        const token = localStorage.getItem("access_token");
        const res = await fetch(
          "http://localhost:8000/api/v1/auth/hierarchy-members/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch hierarchy");

        const resData = await res.json();

        // Update counts
        setStats({
          domains: resData.domains.length,
          organizations: resData.organizations.length,
          departments: resData.departments.length,
          wings: resData.wings.length,
          users: resData.users.length,
          tokens: 1,
        });

        // Filter out empty lists
        setData({
          domains: resData.domains || [],
          organizations: resData.organizations || [],
          departments: resData.departments || [],
          wings: resData.wings || [],
          users: resData.users || [],
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, []);

  // Cards for Overview, filtered to only show if val > 0
  const overviewCards = [
    { label: "TOTAL USERS", val: stats.users, accent: S.accent },
    { label: "DOMAINS", val: stats.domains, accent: S.violet },
    { label: "ORGANIZATIONS", val: stats.organizations, accent: S.orange },
    { label: "DEPARTMENTS", val: stats.departments, accent: S.green },
    { label: "WINGS", val: stats.wings, accent: "#f472b6" },
    { label: "ACTIVE TOKENS", val: stats.tokens, accent: "#facc15" },
  ].filter((s) => s.val > 0); // <- hide zero-count cards

  return (
    <div style={S.content}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: C.accent }}>
          ⬡ Overview
        </div>
        <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1 }}>
          JWT domains: [{user.domains.join(", ")}] · Role: {user.role}
        </div>
      </div>

      <div style={S.statGrid}>
        {overviewCards.map((s) => (
          <div key={s.label} style={S.statCard(s.accent)}>
            <div style={{ ...S.statNum, color: s.accent }}>{s.val}</div>
            <div style={S.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32 }}>
        <h3 style={{ color: C.accent, fontSize: 16, marginBottom: 16, letterSpacing: 1 }}>◈ Hierarchy Details</h3>

        {data.domains.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <strong style={{ color: C.violet }}>⬡ Domains:</strong> <span style={{ color: C.text }}>{data.domains.join(", ")}</span>
          </div>
        )}

        {data.organizations.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <strong style={{ color: C.accent }}>⌥ Organizations:</strong> <span style={{ color: C.text }}>{data.organizations.join(", ")}</span>
          </div>
        )}

        {data.departments.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <strong style={{ color: C.orange }}>◈ Departments:</strong> <span style={{ color: C.text }}>{data.departments.join(", ")}</span>
          </div>
        )}

        {data.wings.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <strong style={{ color: C.green }}>⚿ Wings:</strong> <span style={{ color: C.text }}>{data.wings.join(", ")}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;