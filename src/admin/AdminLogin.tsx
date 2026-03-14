import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./admin.css";
import { User, ApiResponse } from "../types";

export default function AdminLogin({ onLogin }: { onLogin: (user: User, csrfToken: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: username.trim(), password }),
      });

      type LoginResult = { user?: any; csrfToken?: string; error?: string };
      let data: LoginResult = {};
      try {
        data = await res.json();
      } catch {
        setError("Server error. Try again later.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Invalid username or password");
        return;
      }

      onLogin(data.user, data.csrfToken ?? "");
      const returnTo = (location.state as { returnTo?: string } | null)?.returnTo || "/admin/products";
      navigate(returnTo, { replace: true });
    } catch {
      setError("Connection error. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleSubmit} className="admin-login-card">
        <h1>Admin Panel</h1>
        <p className="subtitle">Sign in to manage your cafe</p>

        {error && <div className="admin-alert admin-alert-error">{error}</div>}

        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            className="admin-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <input
            type="password"
            className="admin-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="admin-btn-primary" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
