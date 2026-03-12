import { useEffect, useState } from "react";
import api from "../api";
import { C, S } from "../styles";

export default function SignupPage({ onLogin, onBackToLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    password_confirm: "",
    domain: null,
    organization: null,
    department: null,
    wing: null,
    role_name: "User",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState(null);

  const [domainInput, setDomainInput] = useState("");
  const [orgInput, setOrgInput] = useState("");
  const [deptInput, setDeptInput] = useState("");
  const [wingInput, setWingInput] = useState("");

  const [domains, setDomains] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [wings, setWings] = useState([]);

  // Fetch all hierarchy data on load
  const fetchAll = async () => {
    try {
      const [d, o, dep, w] = await Promise.all([
        api.getDomains(),
        api.getOrganizations(),
        api.getDepartments(),
        api.getWings(),
      ]);
      setDomains(d);
      setOrganizations(o);
      setDepartments(dep);
      setWings(w);
    } catch (err) {
      console.error("Error fetching hierarchy:", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateIfNotExist = async (type, name) => {
    try {
      let res;
      switch (type) {
        case "domain":
          res = await api.request("/domains/", {
            method: "POST",
            body: JSON.stringify({ name }),
          });
          setDomains((prev) => [...prev, res]);
          return res.id;
        case "organization":
          res = await api.request("/organizations/", {
            method: "POST",
            body: JSON.stringify({ name }),
          });
          setOrganizations((prev) => [...prev, res]);
          return res.id;
        case "department":
          res = await api.request("/departments/", {
            method: "POST",
            body: JSON.stringify({ name }),
          });
          setDepartments((prev) => [...prev, res]);
          return res.id;
        case "wing":
          res = await api.request("/wings/", {
            method: "POST",
            body: JSON.stringify({ name }),
          });
          setWings((prev) => [...prev, res]);
          return res.id;
        default:
          return null;
      }
    } catch (err) {
      console.error(`Error creating ${type}:`, err);
      return null;
    }
  };

  const handleSignup = async () => {
    if (!formData.username && !formData.email && !formData.phone) {
      setError(
        "At least one identifier (username, email, or phone) is required",
      );
      return;
    }
    if (!formData.password) {
      setError("Password is required");
      return;
    }
    if (formData.password !== formData.password_confirm) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    // Create hierarchy if not exist
    const domainId =
      formData.domain ||
      (domainInput
        ? await handleCreateIfNotExist("domain", domainInput)
        : null);
    const orgId =
      formData.organization ||
      (orgInput
        ? await handleCreateIfNotExist("organization", orgInput)
        : null);
    const deptId =
      formData.department ||
      (deptInput
        ? await handleCreateIfNotExist("department", deptInput)
        : null);
    const wingId =
      formData.wing ||
      (wingInput ? await handleCreateIfNotExist("wing", wingInput) : null);

    const payload = {
      username: formData.username || undefined,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      password: formData.password,
      domain: domainId || undefined,
      organization: orgId || undefined,
      department: deptId || undefined,
      wing: wingId || undefined,
      role_name: formData.role_name,
    };

    try {
      const response = await api.signup(payload);
      localStorage.setItem("access_token", response.access);
      localStorage.setItem("refresh_token", response.refresh);
      setToken(response);
      setSuccess(true);

      const userData = {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        phone: response.user.phone,
        role: formData.role_name,
      };

      // Save user data to localStorage for session persistence
      localStorage.setItem("user_data", JSON.stringify(userData));

      setTimeout(() => {
        onLogin(userData);
      }, 1500);
    } catch (err) {
      setError(err.message || "Signup failed");
      setLoading(false);
    }
  };

  const [showSuggestions, setShowSuggestions] = useState({
    domain: false,
    organization: false,
    department: false,
    wing: false,
  });

  const autocompleteInput = (input, data) => {
    if (!input) return [];
    return data.filter((item) =>
      item.name.toLowerCase().includes(input.toLowerCase()),
    );
  };

  const handleAutocompleteSelect = (field, item) => {
    handleInputChange(field, item.id);
    switch (field) {
      case 'domain': setDomainInput(item.name); break;
      case 'organization': setOrgInput(item.name); break;
      case 'department': setDeptInput(item.name); break;
      case 'wing': setWingInput(item.name); break;
    }
    setShowSuggestions({ ...showSuggestions, [field]: false });
  };

  const renderAutocompleteInput = (label, input, setInput, data, field) => (
    <div style={{ marginBottom: 16, position: "relative" }}>
      <div style={{ ...S.label, marginBottom: 4 }}>{label}</div>
      <input
        style={{ ...S.input }}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowSuggestions({ ...showSuggestions, [field]: true });
        }}
        onFocus={() => setShowSuggestions({ ...showSuggestions, [field]: true })}
        onBlur={() => setTimeout(() => setShowSuggestions({ ...showSuggestions, [field]: false }), 200)}
        placeholder={`Type or select ${label}`}
      />
      {showSuggestions[field] && autocompleteInput(input, data).length > 0 && (
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
          {autocompleteInput(input, data).map((item) => (
            <div
              key={item.id}
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
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={S.loginWrap}>
      <div style={{ ...S.loginCard, maxWidth: 500 }}>
        <div style={S.loginLogo}>
          <div
            style={{
              ...S.logoSquare,
              backgroundImage: "url('https://www.ntc.net.np/_nuxt/img/logo.6aa152d.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              color: "transparent",
            }}
          />
          <div>
            <div style={S.logoText}>UMS SIGNUP</div>
            <div style={S.logoSub}>CREATE ACCOUNT</div>
          </div>
        </div>

        {/* Identifiers */}
        <div style={{ marginBottom: 20 }}>
          {["username", "email", "phone"].map((field) => (
            <input
              key={field}
              style={{ ...S.input, marginBottom: 8 }}
              type={field === "email" ? "email" : "text"}
              placeholder={field === "phone" ? "+9779800000000" : field}
              value={formData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
            />
          ))}
        </div>

        {/* Password */}
        <div style={{ marginBottom: 20 }}>
          {["password", "password_confirm"].map((field) => (
            <input
              key={field}
              style={{ ...S.input, marginBottom: 8 }}
              type="password"
              placeholder={
                field === "password_confirm" ? "confirm password" : "••••••••"
              }
              value={formData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
            />
          ))}
        </div>

        {/* Hierarchy */}
        {renderAutocompleteInput(
          "Domain",
          domainInput,
          setDomainInput,
          domains,
          "domain",
        )}
        {renderAutocompleteInput(
          "Organization",
          orgInput,
          setOrgInput,
          organizations,
          "organization",
        )}
        {renderAutocompleteInput(
          "Department",
          deptInput,
          setDeptInput,
          departments,
          "department",
        )}
        {renderAutocompleteInput(
          "Wing",
          wingInput,
          setWingInput,
          wings,
          "wing",
        )}

        <select
          style={S.input}
          value={formData.role_name}
          onChange={(e) => handleInputChange("role_name", e.target.value)}
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>

        {error && (
          <div
            style={{
              color: C.red,
              fontSize: 11,
              marginBottom: 10,
              letterSpacing: 1,
            }}
          >
            ⚠ {error}
          </div>
        )}

        <button
          style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}
          onClick={handleSignup}
        >
          {loading ? "CREATING ACCOUNT..." : "→ CREATE ACCOUNT"}
        </button>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button
            style={{
              background: "transparent",
              border: "none",
              color: C.muted,
              fontSize: 11,
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={onBackToLogin}
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
