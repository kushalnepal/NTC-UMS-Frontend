import { useEffect, useState } from "react";
import { C } from "../styles";

// -----------------------
// MembersPage Component
// -----------------------

function MembersPage({ user }) {
  // Check if current user is admin
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Hierarchy data for autocomplete
  const [hierarchyData, setHierarchyData] = useState({
    domains: [],
    organizations: [],
    departments: [],
    wings: [],
  });

  // Autocomplete input states
  const [domainInput, setDomainInput] = useState("");
  const [orgInput, setOrgInput] = useState("");
  const [deptInput, setDeptInput] = useState("");
  const [wingInput, setWingInput] = useState("");

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    phone: "",
    role: "user",
    domain: null,
    organization: null,
    department: null,
    wing: null,
    is_staff: false,
  });

  const token = localStorage.getItem("access_token"); // Must be set from admin login somewhere

  // -----------------------
  // Fetch hierarchy users
  // -----------------------
  const fetchHierarchyUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/v1/auth/hierarchy-members/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 401) {
        alert("Session expired. Please login again.");
        setUsers([]);
        return;
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };
  const showOrganization = users.some(u => u.organization);
  const showDepartment = users.some(u => u.department);
  const showWing = users.some(u => u.wing);
  // Only show actions column for admins
  const showActions = isAdmin;

  useEffect(() => {
    fetchHierarchyUsers();
    fetchHierarchyData();
  }, []);

  // -----------------------
  // Fetch hierarchy data for autocomplete
  // -----------------------
  const fetchHierarchyData = async () => {
    if (!token) return;
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/v1/auth/hierarchy-members/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setHierarchyData({
        domains: data.domains || [],
        organizations: data.organizations || [],
        departments: data.departments || [],
        wings: data.wings || [],
      });
    } catch (err) {
      console.error("Failed to fetch hierarchy data", err);
    }
  };

  // -----------------------
  // Autocomplete helpers
  // -----------------------
  const [showSuggestions, setShowSuggestions] = useState({
    domain: false,
    organization: false,
    department: false,
    wing: false,
  });

  const filterAutocomplete = (input, data) => {
    if (!input) return [];
    return data.filter((item) =>
      item.toLowerCase().includes(input.toLowerCase())
    );
  };

  const handleAutocompleteSelect = (field, value) => {
    setNewUser({ ...newUser, [field]: value });
    switch (field) {
      case 'domain': setDomainInput(value); break;
      case 'organization': setOrgInput(value); break;
      case 'department': setDeptInput(value); break;
      case 'wing': setWingInput(value); break;
    }
    setShowSuggestions({ ...showSuggestions, [field]: false });
  };

  const renderAutocompleteField = (label, input, setInput, data, field, icon) => (
    <div style={{ marginBottom: 16, position: "relative" }}>
      <label style={labelStyle}>{icon} {label}</label>
      <input
        style={inputStyle}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowSuggestions({ ...showSuggestions, [field]: true });
        }}
        onFocus={() => setShowSuggestions({ ...showSuggestions, [field]: true })}
        onBlur={() => setTimeout(() => setShowSuggestions({ ...showSuggestions, [field]: false }), 200)}
        placeholder={`Type or select ${label}`}
      />
      {showSuggestions[field] && filterAutocomplete(input, data).length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            maxHeight: 150,
            overflowY: "auto",
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            zIndex: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {filterAutocomplete(input, data).map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                color: C.text,
                fontSize: 13,
                borderBottom: `1px solid ${C.faint}`,
                transition: "background 0.15s",
              }}
              onClick={() => handleAutocompleteSelect(field, item)}
              onMouseEnter={(e) => e.target.style.background = C.faint}
              onMouseLeave={(e) => e.target.style.background = "transparent"}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // -----------------------
  // CREATE user
  // -----------------------
  const createUser = async () => {
    if (!token) return;
    try {
      const userData = {
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        password: newUser.password,
        password_confirm: newUser.password_confirm,
        role: newUser.role,
        is_staff: newUser.is_staff,
      };

      // Only add hierarchy fields if they have values
      if (domainInput) userData.domain = domainInput;
      if (orgInput) userData.organization = orgInput;
      if (deptInput) userData.department = deptInput;
      if (wingInput) userData.wing = wingInput;

      const res = await fetch("http://127.0.0.1:8000/api/v1/auth/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok) {
        setNewUser({
          username: "",
          email: "",
          password: "",
          password_confirm: "",
          phone: "",
          role: "user",
          domain: null,
          organization: null,
          department: null,
          wing: null,
          is_staff: false,
        });
        setDomainInput("");
        setOrgInput("");
        setDeptInput("");
        setWingInput("");
        setShowAddModal(false);
        fetchHierarchyUsers();
      } else {
        alert(JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------
  // UPDATE user
  // -----------------------
  const updateUser = async () => {
    if (!editingUser || !token) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/v1/auth/users/${editingUser.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editingUser),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setEditingUser(null);
        fetchHierarchyUsers();
      } else {
        alert(JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------
  // DELETE user
  // -----------------------
  const deleteUser = async (id) => {
    if (!token) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/v1/auth/users/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) fetchHierarchyUsers();
      else {
        const data = await res.json();
        alert(JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  // Table styles
  const tableThStyle = {
    fontSize: 10,
    color: C.muted,
    letterSpacing: 2,
    textAlign: "left",
    padding: "12px 16px",
    borderBottom: `1px solid ${C.border}`,
    fontWeight: 600,
  };

  const tableTdStyle = {
    padding: "12px 16px",
    borderBottom: `1px solid ${C.faint}`,
    fontSize: 12,
    color: C.text,
  };

  const tableInputStyle = {
    width: "100%",
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: 6,
    color: C.text,
    fontSize: 12,
    padding: "6px 10px",
    outline: "none",
  };

  const tableSelectStyle = {
    width: "100%",
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: 6,
    color: C.text,
    fontSize: 12,
    padding: "6px 10px",
    cursor: "pointer",
  };

  const roleBadgeStyle = {
    fontSize: 9,
    letterSpacing: 1,
    padding: "3px 8px",
    borderRadius: 4,
    fontWeight: 700,
  };

  const actionBtnStyle = {
    padding: "6px 12px",
    fontSize: 11,
    borderRadius: 6,
    cursor: "pointer",
    border: "none",
    marginRight: 6,
    fontWeight: 600,
  };

  const editBtnStyle = {
    ...actionBtnStyle,
    background: C.accentDim,
    color: C.accent,
  };

  const deleteBtnStyle = {
    ...actionBtnStyle,
    background: C.redDim,
    color: C.red,
  };

  const saveBtnStyle = {
    ...actionBtnStyle,
    background: C.greenDim,
    color: C.green,
    marginRight: 6,
  };

  const cancelBtnStyle = {
    ...actionBtnStyle,
    background: C.faint,
    color: C.muted,
  };

  // Modal styles
  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalContentStyle = {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: "28px 32px",
    width: "100%",
    maxWidth: 420,
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const modalTitleStyle = {
    fontSize: 18,
    fontWeight: 700,
    color: C.text,
    marginBottom: 24,
    letterSpacing: -0.5,
  };

  const labelStyle = {
    fontSize: 10,
    color: C.muted,
    letterSpacing: 2,
    marginBottom: 6,
    display: "block",
  };

  const inputStyle = {
    width: "100%",
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    color: C.text,
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 13,
    padding: "11px 14px",
    outline: "none",
    marginBottom: 16,
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
  };

  const formRowStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  };

  const checkboxLabelStyle = {
    fontSize: 12,
    color: C.text,
    cursor: "pointer",
  };

  const modalBtnRowStyle = {
    display: "flex",
    gap: 12,
    marginTop: 24,
  };

  const primaryBtnStyle = {
    flex: 1,
    background: C.accent,
    color: "#080b10",
    border: "none",
    borderRadius: 8,
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 700,
    fontSize: 13,
    padding: "12px 0",
    cursor: "pointer",
    letterSpacing: 1,
    transition: "opacity 0.2s",
  };

  const secondaryBtnStyle = {
    flex: 1,
    background: "transparent",
    color: C.muted,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 600,
    fontSize: 13,
    padding: "12px 0",
    cursor: "pointer",
    letterSpacing: 1,
    transition: "all 0.2s",
  };

  const pageHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  };

  const titleStyle = {
    fontSize: 20,
    fontWeight: 700,
    color: C.text,
    letterSpacing: -0.5,
  };

  const addBtnStyle = {
    background: "#ffcc00",
    color: "#080b10",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: 1,
    fontFamily: "'IBM Plex Mono', monospace",
    transition: "opacity 0.2s",
  };

  return (
    <div style={{ padding: 28 }}>
      {/* Header with Add User button */}
      <div style={pageHeaderStyle}>
        <h2 style={titleStyle}>Hierarchy Members</h2>
        {isAdmin && (
          <button style={addBtnStyle} onClick={() => setShowAddModal(true)}>
            + Add User
          </button>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div style={modalOverlayStyle} onClick={() => setShowAddModal(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={modalTitleStyle}>Add New User</h3>

            <label style={labelStyle}>Username</label>
            <input
              style={inputStyle}
              placeholder="Enter username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />

            <label style={labelStyle}>Email</label>
            <input
              style={inputStyle}
              type="email"
              placeholder="Enter email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />

            <label style={labelStyle}>Phone</label>
            <input
              style={inputStyle}
              placeholder="Enter phone number"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            />

            <label style={labelStyle}>Password</label>
            <input
              style={inputStyle}
              type="password"
              placeholder="Enter password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />

            <label style={labelStyle}>Confirm Password</label>
            <input
              style={inputStyle}
              type="password"
              placeholder="Confirm password"
              value={newUser.password_confirm}
              onChange={(e) =>
                setNewUser({ ...newUser, password_confirm: e.target.value })
              }
            />

            {/* Hierarchy Autocomplete Fields */}
            {renderAutocompleteField("Domain", domainInput, setDomainInput, hierarchyData.domains, "domain", "⬡")}
            {renderAutocompleteField("Organization", orgInput, setOrgInput, hierarchyData.organizations, "organization", "⌥")}
            {renderAutocompleteField("Department", deptInput, setDeptInput, hierarchyData.departments, "department", "◈")}
            {renderAutocompleteField("Wing", wingInput, setWingInput, hierarchyData.wings, "wing", "⚿")}

            <label style={labelStyle}>Role</label>
            <select
              style={selectStyle}
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div style={formRowStyle}>
              <input
                type="checkbox"
                id="is_staff"
                checked={newUser.is_staff}
                onChange={(e) =>
                  setNewUser({ ...newUser, is_staff: e.target.checked })
                }
                style={{ cursor: "pointer" }}
              />
              <label htmlFor="is_staff" style={checkboxLabelStyle}>
                Staff User
              </label>
            </div>

            <div style={modalBtnRowStyle}>
              <button
                style={secondaryBtnStyle}
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button style={primaryBtnStyle} onClick={createUser}>
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users table - styled */}
      <div style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        overflow: "hidden",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.faint }}>
              <th style={{ ...tableThStyle }}>Username</th>
              <th style={{ ...tableThStyle }}>Email</th>
              <th style={{ ...tableThStyle }}>Phone</th>
              <th style={{ ...tableThStyle }}>Role</th>
              <th style={{ ...tableThStyle }}>Is Staff</th>

              {showOrganization && <th style={{ ...tableThStyle }}>⌥ Organization</th>}
              {showDepartment && <th style={{ ...tableThStyle }}>◈ Department</th>}
              {showWing && <th style={{ ...tableThStyle }}>⚿ Wing</th>}
              {showActions && <th style={{ ...tableThStyle }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: `1px solid ${C.faint}` }}>
                <td style={tableTdStyle}>
                  {editingUser?.id === u.id ? (
                    <input
                      style={tableInputStyle}
                      value={editingUser.username}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, username: e.target.value })
                      }
                    />
                  ) : (
                    <span style={{ color: C.text, fontWeight: 500 }}>{u.username}</span>
                  )}
                </td>
                <td style={tableTdStyle}>
                  {editingUser?.id === u.id ? (
                    <input
                      style={tableInputStyle}
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, email: e.target.value })
                      }
                    />
                  ) : (
                    <span style={{ color: C.muted }}>{u.email || "-"}</span>
                  )}
                </td>
                <td style={tableTdStyle}>
                  {editingUser?.id === u.id ? (
                    <input
                      style={tableInputStyle}
                      value={editingUser.phone}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, phone: e.target.value })
                      }
                    />
                  ) : (
                    <span style={{ color: C.muted }}>{u.phone || "-"}</span>
                  )}
                </td>
                <td style={tableTdStyle}>
                  {editingUser?.id === u.id ? (
                    <select
                      style={tableSelectStyle}
                      value={editingUser.role}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, role: e.target.value })
                      }
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span style={{
                      ...roleBadgeStyle,
                      background: u.role === "Admin" ? C.orangeDim : C.accentDim,
                      color: u.role === "Admin" ? C.orange : C.accent,
                    }}>
                      {u.role}
                    </span>
                  )}
                </td>
                {/* Is Staff */}
                <td style={tableTdStyle}>
                  {(() => {
                    // Check for different possible field names
                    const staffValue = u.is_staff ?? u.isStaff ?? u.staff ?? false;
                    const editStaffValue = editingUser?.is_staff ?? editingUser?.isStaff ?? editingUser?.staff ?? false;

                    return editingUser?.id === u.id ? (
                      <input
                        type="checkbox"
                        checked={editStaffValue}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, is_staff: e.target.checked, isStaff: e.target.checked })
                        }
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <span style={{
                        fontSize: 9,
                        letterSpacing: 1,
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontWeight: 700,
                        background: staffValue ? C.accentDim : C.faint,
                        color: staffValue ? C.accent : C.muted,
                      }}>
                        {staffValue ? "Yes" : "No"}
                      </span>
                    );
                  })()}
                </td>
                {/* Organization */}
                {u.organization ? <td style={tableTdStyle}><span style={{ color: C.accent }}>{u.organization}</span></td> : null}

                {/* Department */}
                {u.department ? <td style={tableTdStyle}><span style={{ color: C.orange }}>{u.department}</span></td> : null}

                {/* Wing */}
                {u.wing ? <td style={tableTdStyle}><span style={{ color: C.green }}>{u.wing}</span></td> : null}
                {isAdmin && (
                  <td style={tableTdStyle}>
                    {editingUser?.id === u.id ? (
                      <>
                        <button style={saveBtnStyle} onClick={updateUser}>Save</button>
                        <button style={cancelBtnStyle} onClick={() => setEditingUser(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button style={editBtnStyle} onClick={() => setEditingUser({ ...u, is_staff: u.is_staff ?? u.isStaff ?? u.staff ?? false, isStaff: u.is_staff ?? u.isStaff ?? u.staff ?? false })}>Edit</button>
                        <button style={deleteBtnStyle} onClick={() => deleteUser(u.id)}>Delete</button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MembersPage;