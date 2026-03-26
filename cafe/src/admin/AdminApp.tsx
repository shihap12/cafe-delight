import { useState, useEffect } from "react";
import { User } from "../types";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import AdminLayout from "./AdminLayout";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminSettings from "./AdminSettings";
import "./admin.css";

export default function AdminApp() {
  type AuthState = { checking: boolean; user: User | null; csrfToken: string };
  const [auth, setAuth] = useState<AuthState>({
    checking: true,
    user: null,
    csrfToken: "",
  });

  // keep router hooks at top-level so hook order doesn't change between renders
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth.php", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.authenticated) {
        setAuth({
          checking: false,
          user: data.user,
          csrfToken: data.csrfToken,
        });
      } else {
        setAuth({ checking: false, user: null, csrfToken: "" });
      }
    } catch {
      setAuth({ checking: false, user: null, csrfToken: "" });
    }
  };

  const handleLogin = (user: User, csrfToken: string) => {
    setAuth({ checking: false, user, csrfToken });
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth.php", {
        method: "DELETE",
        credentials: "include",
      });
    } catch {
      // ignore
    }
    setAuth({ checking: false, user: null, csrfToken: "" });
  };

  if (auth.checking) {
    return <div className="admin-loading">Loading...</div>;
  }

  if (!auth.user) {
    const returnTo = location.pathname + location.search;
    return (
      <Routes>
        <Route path="/" element={<AdminLogin onLogin={handleLogin} />} />
        <Route
          path="*"
          element={<Navigate to="/admin" replace state={{ returnTo }} />}
        />
      </Routes>
    );
  }

  return (
    <AdminLayout user={auth.user} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/products" replace />} />
        <Route
          path="/products"
          element={<AdminProducts csrfToken={auth.csrfToken} />}
        />
        <Route
          path="/orders"
          element={<AdminOrders csrfToken={auth.csrfToken} />}
        />
        <Route
          path="/settings"
          element={<AdminSettings csrfToken={auth.csrfToken} />}
        />
      </Routes>
    </AdminLayout>
  );
}
