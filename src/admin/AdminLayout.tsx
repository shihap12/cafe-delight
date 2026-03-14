import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FaCoffee,
  FaBoxOpen,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

const NAV_ITEMS = [
  { to: "/admin/products", icon: FaBoxOpen, label: "Products" },
  { to: "/admin/orders", icon: FaClipboardList, label: "Orders" },
  { to: "/admin/settings", icon: FaCog, label: "Settings" },
];

export default function AdminLayout({ user, onLogout, children }: { user: { username?: string }, onLogout: () => void, children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const currentPage =
    NAV_ITEMS.find((n) => location.pathname.startsWith(n.to))?.label ||
    "Dashboard";

  return (
    <div className="admin-layout">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`admin-sidebar ${sidebarOpen ? "open" : ""} ${
          sidebarCollapsed ? "collapsed" : ""
        }`}
      >
        <div className="admin-sidebar-brand">
          <FaCoffee className="text-amber-400" size={22} />
          <h2>Cafe Admin</h2>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div
            style={{
              fontSize: "0.8rem",
              color: "#94a3b8",
              marginBottom: "0.75rem",
            }}
          >
            Logged in as{" "}
            <strong style={{ color: "#e2e8f0" }}>{user.username}</strong>
          </div>
          <button
            onClick={onLogout}
            className="admin-btn admin-btn-sm"
            style={{
              color: "#f87171",
              background: "transparent",
              border: "1px solid #991b1b33",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <FaSignOutAlt size={12} /> Logout
          </button>
        </div>
      </aside>

      <div className={`admin-main ${sidebarCollapsed ? "expanded" : ""}`}>
        <div className="admin-topbar">
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <button
              className="admin-btn admin-btn-gray sidebar-toggle-desktop"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{
                padding: "0.5rem",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "36px",
              }}
            >
              <FaBars size={18} />
            </button>
            <h1
              style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1e293b" }}
            >
              {currentPage}
            </h1>
          </div>

          <button
            className="admin-btn admin-btn-gray sidebar-toggle-mobile"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ padding: "0.5rem" }}
          >
            <FaBars size={18} />
          </button>
        </div>

        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
