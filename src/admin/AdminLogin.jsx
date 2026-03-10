import { useState } from "react";
import "./admin.css";

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
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

      let data = {};
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

      onLogin(data.user, data.csrfToken);
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
