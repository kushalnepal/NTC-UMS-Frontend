import { useEffect, useState } from "react";
import DashboardPage from "./components/DashboardPage";
import HierarchyPage from "./components/HierarchyPage";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";
import MembersPage from "./components/MembersPage";
import SignupPage from "./components/SignupPage";
import TokensPage from "./components/TokensPage";
import { S } from "./styles";

export default function App() {
  const [page, setPage] = useState("login");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [user, setUser] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user_data");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setPage("app");
      } catch (e) {
        // Invalid user data, clear storage
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_data");
      }
    }
  }, []);

  const handleLogin = (u) => {
    // Save user data to localStorage for session persistence
    localStorage.setItem("user_data", JSON.stringify(u));
    setUser(u);
    setPage("app");
  };

  const handleSignup = () => {
    setPage("signup");
  };

  const handleBackToLogin = () => {
    setPage("login");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
    setUser(null);
    setPage("login");
  };

  if (page === "login")
    return (
      <div style={S.app}>
        <LoginPage onLogin={handleLogin} onSignup={handleSignup} />
      </div>
    );

  if (page === "signup")
    return (
      <div style={S.app}>
        <SignupPage onLogin={handleLogin} onBackToLogin={handleBackToLogin} />
      </div>
    );

  return (
    <Layout
      user={user}
      activeNav={activeNav}
      setActiveNav={setActiveNav}
      onLogout={handleLogout}
    >
      {activeNav === "dashboard" && <DashboardPage user={user} />}
      {activeNav === "hierarchy" && <HierarchyPage />}
      {activeNav === "members" && <MembersPage user={user} />}
      {activeNav === "tokens" && <TokensPage user={user} />}
    </Layout>
  );
}
