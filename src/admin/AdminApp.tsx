import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import AdminLayout from "./AdminLayout";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminSettings from "./AdminSettings";
import "./admin.css";

export default function AdminApp() {
  const [auth, setAuth] = useState<any>({
    checking: true,
    user: null,
    csrfToken: "",
  });

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

  const handleLogin = (user: any, csrfToken: string) => {
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

  const location = useLocation();
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
