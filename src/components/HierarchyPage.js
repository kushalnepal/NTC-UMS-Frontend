import { useEffect, useState } from "react";
import { C } from "../styles";

function HierarchyPage() {
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
        const res = await fetch(
          "http://127.0.0.1:8000/api/v1/auth/hierarchy-members/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch hierarchy");

        const resData = await res.json();
        setData(resData);
      } catch (err) {
        console.error("Failed to load hierarchy", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHierarchy();
  }, []);

  if (loading) return <div style={{ padding: 28, color: C.text }}>Loading hierarchy...</div>;

  const hasData =
    data.domains.length ||
    data.organizations.length ||
    data.departments.length ||
    data.wings.length ||
    data.users.length;

  if (!hasData)
    return <div style={{ padding: 28, color: C.muted }}>No hierarchy assigned</div>;

  // Styles for the hierarchy tree
  const treeContainerStyle = {
    padding: 28,
    maxWidth: 900,
  };

  const pageTitleStyle = {
    fontSize: 20,
    fontWeight: 700,
    color: C.accent,
    marginBottom: 28,
    letterSpacing: -0.5,
  };

  const hierarchyLevelStyle = {
    marginBottom: 24,
  };

  const levelTitleStyle = {
    fontSize: 12,
    color: C.muted,
    letterSpacing: 2,
    marginBottom: 12,
    textTransform: "uppercase",
  };

  const itemCardStyle = {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: "12px 16px",
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
    gap: 12,
    transition: "border-color 0.2s",
  };

  const itemIconStyle = {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: 700,
  };

  const itemTextStyle = {
    fontSize: 14,
    color: C.text,
    fontWeight: 500,
  };

  const arrowContainerStyle = {
    display: "flex",
    alignItems: "center",
    padding: "8px 0",
    marginLeft: 15,
  };

  const arrowLineStyle = {
    width: 2,
    height: 20,
    background: C.accent,
  };

  const arrowHeadStyle = {
    width: 0,
    height: 0,
    borderLeft: "6px solid transparent",
    borderRight: "6px solid transparent",
    borderTop: `8px solid ${C.accent}`,
    marginLeft: -5,
  };

  const domainIconStyle = {
    ...itemIconStyle,
    background: C.violetDim,
    color: C.violet,
  };

  const orgIconStyle = {
    ...itemIconStyle,
    background: C.accentDim,
    color: C.accent,
  };

  const deptIconStyle = {
    ...itemIconStyle,
    background: C.orangeDim,
    color: C.orange,
  };

  const wingIconStyle = {
    ...itemIconStyle,
    background: C.greenDim,
    color: C.green,
  };

  const userIconStyle = {
    ...itemIconStyle,
    background: C.redDim,
    color: C.red,
  };

  // Render arrow between levels
  const renderArrow = () => (
    <div style={arrowContainerStyle}>
      <div style={arrowLineStyle} />
      <div style={arrowHeadStyle} />
    </div>
  );

  return (
    <div style={treeContainerStyle}>
      <h2 style={pageTitleStyle}>◈ Organization Hierarchy</h2>

      {/* Domains */}
      {data.domains.length > 0 && (
        <div style={hierarchyLevelStyle}>
          <div style={levelTitleStyle}>⬡ Domains</div>
          {data.domains.map((domain, idx) => (
            <div key={idx} style={itemCardStyle}>
              <div style={domainIconStyle}>⬡</div>
              <span style={itemTextStyle}>{domain}</span>
            </div>
          ))}
          {data.organizations.length > 0 && renderArrow()}
        </div>
      )}

      {/* Organizations */}
      {data.organizations.length > 0 && (
        <div style={hierarchyLevelStyle}>
          <div style={levelTitleStyle}>⌥ Organizations</div>
          {data.organizations.map((org, idx) => (
            <div key={idx} style={itemCardStyle}>
              <div style={orgIconStyle}>⌥</div>
              <span style={itemTextStyle}>{org}</span>
            </div>
          ))}
          {data.departments.length > 0 && renderArrow()}
        </div>
      )}

      {/* Departments */}
      {data.departments.length > 0 && (
        <div style={hierarchyLevelStyle}>
          <div style={levelTitleStyle}>◈ Departments</div>
          {data.departments.map((dept, idx) => (
            <div key={idx} style={itemCardStyle}>
              <div style={deptIconStyle}>◈</div>
              <span style={itemTextStyle}>{dept}</span>
            </div>
          ))}
          {data.wings.length > 0 && renderArrow()}
        </div>
      )}

      {/* Wings */}
      {data.wings.length > 0 && (
        <div style={hierarchyLevelStyle}>
          <div style={levelTitleStyle}>⚿ Wings</div>
          {data.wings.map((wing, idx) => (
            <div key={idx} style={itemCardStyle}>
              <div style={wingIconStyle}>⚿</div>
              <span style={itemTextStyle}>{wing}</span>
            </div>
          ))}
        </div>
      )}

      {/* Users at the bottom */}
      {data.users.length > 0 && (
        <div style={hierarchyLevelStyle}>
          {renderArrow()}
          <div style={levelTitleStyle}>👥 Members</div>
          {data.users.map((user, idx) => (
            <div key={idx} style={itemCardStyle}>
              <div style={userIconStyle}>👤</div>
              <span style={itemTextStyle}>{user.username || user.email}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HierarchyPage;
