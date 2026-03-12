import { useState } from "react";
import { S } from "../styles";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

function LoginPage({ onLogin, onSignup }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [error, setError] = useState("");
  const [focusId, setFocusId] = useState(false);
  const [focusPw, setFocusPw] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      setError("All fields required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      setToken(data);

      // Decode JWT to get user info
      const payload = JSON.parse(atob(data.access.split(".")[1]));

      // Get role from memberships - check if user has any admin role
      const userRole = data.memberships?.some(m => m.role.toLowerCase() === "admin")
        ? "Admin"
        : "User";

      const userData = {
        id: payload.user_id,
        username: payload.username,
        domains: payload.domains || [],
        role: userRole,
      };

      // Save user data to localStorage for session persistence
      localStorage.setItem("user_data", JSON.stringify(userData));

      setTimeout(() => {
        onLogin(userData);
      }, 1200);
    } catch (err) {
      setError("Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div style={S.loginWrap}>
      <div style={S.loginCard}>
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
            <div style={S.logoText}>UMS PORTAL</div>
            <div style={S.logoSub}>USER MANAGEMENT SYSTEM</div>
          </div>
        </div>

        <div style={S.loginTitle}>Sign in</div>
        <div style={S.loginSub}>MULTI-IDENTIFIER AUTH · JWT · RBAC</div>

        <label style={S.label}>IDENTIFIER</label>
        <input
          style={{ ...S.input, borderColor: focusId ? S.accent : S.border }}
          placeholder="username / email / phone"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          onFocus={() => setFocusId(true)}
          onBlur={() => setFocusId(false)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <label style={S.label}>PASSWORD</label>
        <input
          style={{ ...S.input, borderColor: focusPw ? S.accent : S.border }}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setFocusPw(true)}
          onBlur={() => setFocusPw(false)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        {error && (
          <div
            style={{
              color: S.red,
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
          onClick={handleLogin}
        >
          {loading ? "AUTHENTICATING..." : "→ SIGN IN"}
        </button>

        <div style={{ textAlign: "center", marginTop: 10 }}>
          <span style={{ color: S.muted, fontSize: 12 }}>
            Don't have an account?{" "}
            <span
              style={{
                color: S.accent,
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={onSignup}
            >
              Sign up
            </span>
          </span>
        </div>

        {token && (
          <div style={S.tokenBox}>
            <div style={{ color: S.muted, marginBottom: 4 }}>
              // POST /api/v1/auth/login/ → 200 OK
            </div>
            <div>
              <span style={{ color: S.muted }}>access:</span>{" "}
              {token.access.slice(0, 40)}...
            </div>
            <div>
              <span style={{ color: S.muted }}>refresh:</span>{" "}
              {token.refresh.slice(0, 38)}...
            </div>
            <div>
              <span style={{ color: S.muted }}>expires_in:</span>{" "}
              <span style={{ color: S.orange }}>{token.expires_in}s</span>
            </div>
            <div style={{ color: S.accent, marginTop: 6 }}>
              ✓ redirecting to dashboard...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
