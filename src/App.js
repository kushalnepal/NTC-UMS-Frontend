import { useState } from "react";
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

  const handleLogin = (u) => {
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
