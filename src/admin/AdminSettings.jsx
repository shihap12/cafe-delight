import { useState, useEffect, useRef } from "react";
import { FaSave, FaUpload, FaKey } from "react-icons/fa";

const CONTENT_DEFAULTS = {
  hero_line1: "Taste",
  hero_line2: "The",
  hero_line3: "Passion",
  hero_subtitle:
    "Experience the finest coffee and desserts in a cozy atmosphere. Order online now.",
  hero_image: "/images/latte-art.jpg",
  about_title: "About Cafe Delight",
  about_text1:
    "Cafe Delight is a cozy spot serving handcrafted coffee and freshly baked desserts. We source premium beans and prepare each cup with care.",
  about_text2:
    "Visit us for a relaxing atmosphere, specialty drinks, and a selection of house-made sweets.",
  about_image: "/images/coffee-grinding.jpg",
  footer_brand: "CAFE DELIGHT",
  footer_tagline: "Taste the Passion in Every Sip",
  social_instagram: "#",
  social_tiktok: "#",
  social_facebook: "#",
  social_whatsapp: "#",
};

const THEME_DEFAULTS = {
  classic: {
    cafeBg: "#f8f5ef",
    cafeText: "#1f1b16",
    cafeMuted: "#6d655c",
    cafeAccent: "#d97706",
    cafeAccent2: "#ea580c",
    cafeSurface: "#201810",
    cafeSurfaceCard: "#2a2118",
    cafeSurfaceFooter: "#18120c",
    cafeSurfaceText: "#f0e9e0",
    cafeSurfaceMuted: "#b6ab9f",
    cafeBorder: "#4a3a2b",
  },
  midnight: {
    cafeBg: "#0f1115",
    cafeText: "#ece9e4",
    cafeMuted: "#b7afa4",
    cafeAccent: "#f59e0b",
    cafeAccent2: "#fb7185",
    cafeSurface: "#131926",
    cafeSurfaceCard: "#1a2233",
    cafeSurfaceFooter: "#0f1521",
    cafeSurfaceText: "#e7ebf3",
    cafeSurfaceMuted: "#9aa6bd",
    cafeBorder: "#304059",
  },
  sunset: {
    cafeBg: "#fff6ea",
    cafeText: "#2f1d12",
    cafeMuted: "#8a6148",
    cafeAccent: "#c2410c",
    cafeAccent2: "#db2777",
    cafeSurface: "#3a2316",
    cafeSurfaceCard: "#4b2d1c",
    cafeSurfaceFooter: "#2d1a10",
    cafeSurfaceText: "#ffeede",
    cafeSurfaceMuted: "#f0c7ad",
    cafeBorder: "#8c5537",
  },
};

const COLOR_LABELS = {
  cafeBg: "Background",
  cafeText: "Text Color",
  cafeMuted: "Muted Text",
  cafeAccent: "Accent Color",
  cafeAccent2: "Accent 2",
  cafeSurface: "Surface BG",
  cafeSurfaceCard: "Card BG",
  cafeSurfaceFooter: "Footer BG",
  cafeSurfaceText: "Surface Text",
  cafeSurfaceMuted: "Surface Muted",
  cafeBorder: "Border Color",
};

export default function AdminSettings({ csrfToken }) {
  const [tab, setTab] = useState("content");
  const [content, setContent] = useState({ ...CONTENT_DEFAULTS });
  const [themes, setThemes] = useState({
    classic: { ...THEME_DEFAULTS.classic },
    midnight: { ...THEME_DEFAULTS.midnight },
    sunset: { ...THEME_DEFAULTS.sunset },
  });
  const [activeTheme, setActiveTheme] = useState("classic");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(true);

  // Password change
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwStatus, setPwStatus] = useState({ type: "", msg: "" });

  const uploadRefs = { hero: useRef(null), about: useRef(null) };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings.php", {
        credentials: "include",
      });
      const data = await res.json();
      const s = data.data || {};

      // Merge loaded settings with defaults
      const newContent = { ...CONTENT_DEFAULTS };
      Object.keys(CONTENT_DEFAULTS).forEach((k) => {
        if (s[k] !== undefined) newContent[k] = s[k];
      });
      setContent(newContent);

      const newThemes = { ...themes };
      ["classic", "midnight", "sunset"].forEach((t) => {
        if (s[`theme_${t}`] && typeof s[`theme_${t}`] === "object") {
          newThemes[t] = { ...THEME_DEFAULTS[t], ...s[`theme_${t}`] };
        }
      });
      setThemes(newThemes);
    } catch {
      // Use defaults
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus({ type: "", msg: "" });

    const payload = { ...content };
    ["classic", "midnight", "sunset"].forEach((t) => {
      payload[`theme_${t}`] = themes[t];
    });

    try {
      const res = await fetch("/api/admin/settings.php", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const d = await res.json();
        setStatus({ type: "error", msg: d.error || "Save failed" });
        return;
      }

      setStatus({
        type: "success",
        msg: "Settings saved! Refresh user site to see changes.",
      });
    } catch {
      setStatus({ type: "error", msg: "Connection error" });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file, field) => {
    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await fetch("/api/admin/upload.php", {
        method: "POST",
        headers: { "X-CSRF-Token": csrfToken },
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.path) {
        setContent((c) => ({ ...c, [field]: data.path }));
      }
    } catch {
      // ignore
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwStatus({ type: "", msg: "" });

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwStatus({ type: "error", msg: "Passwords do not match" });
      return;
    }

    if (pwForm.newPassword.length < 6) {
      setPwStatus({
        type: "error",
        msg: "New password must be at least 6 characters",
      });
      return;
    }

    try {
      const res = await fetch("/api/admin/auth.php", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPwStatus({ type: "error", msg: data.error || "Failed" });
        return;
      }

      setPwStatus({ type: "success", msg: "Password changed successfully" });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setPwStatus({ type: "error", msg: "Connection error" });
    }
  };

  const updateThemeColor = (theme, key, value) => {
    setThemes((prev) => ({
      ...prev,
      [theme]: { ...prev[theme], [key]: value },
    }));
  };

  const resetTheme = (theme) => {
    setThemes((prev) => ({
      ...prev,
      [theme]: { ...THEME_DEFAULTS[theme] },
    }));
  };

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
        Loading settings...
      </div>
    );
  }

  return (
    <div>
      {status.msg && (
        <div
          className={`admin-alert ${status.type === "success" ? "admin-alert-success" : "admin-alert-error"}`}
        >
          {status.msg}
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs">
        {["content", "themes", "security"].map((t) => (
          <button
            key={t}
            className={`admin-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "content"
              ? "Content"
              : t === "themes"
                ? "Theme Colors"
                : "Security"}
          </button>
        ))}
      </div>

      {/* ── Content Tab ── */}
      {tab === "content" && (
        <div className="admin-card">
          <div className="admin-card-body">
            {/* Hero Section */}
            <h4
              style={{
                fontWeight: 600,
                color: "#1e293b",
                marginBottom: "1rem",
                fontSize: "1rem",
              }}
            >
              Hero Section
            </h4>
            <div className="admin-settings-grid">
              <div className="admin-form-group">
                <label>Title Line 1</label>
                <input
                  className="admin-input"
                  value={content.hero_line1}
                  onChange={(e) =>
                    setContent({ ...content, hero_line1: e.target.value })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label>Title Line 2</label>
                <input
                  className="admin-input"
                  value={content.hero_line2}
                  onChange={(e) =>
                    setContent({ ...content, hero_line2: e.target.value })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label>Title Line 3</label>
                <input
                  className="admin-input"
                  value={content.hero_line3}
                  onChange={(e) =>
                    setContent({ ...content, hero_line3: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="admin-form-group">
              <label>Subtitle</label>
              <textarea
                className="admin-input"
                value={content.hero_subtitle}
                onChange={(e) =>
                  setContent({ ...content, hero_subtitle: e.target.value })
                }
              />
            </div>
            <div className="admin-form-group">
              <label>Hero Image</label>
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <input
                  className="admin-input"
                  value={content.hero_image}
                  onChange={(e) =>
                    setContent({ ...content, hero_image: e.target.value })
                  }
                  style={{ flex: 1 }}
                />
                <input
                  ref={uploadRefs.hero}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) =>
                    handleImageUpload(e.target.files?.[0], "hero_image")
                  }
                />
                <button
                  className="admin-btn admin-btn-gray"
                  onClick={() => uploadRefs.hero.current?.click()}
                >
                  <FaUpload size={12} /> Upload
                </button>
              </div>
              {content.hero_image && (
                <img
                  src={content.hero_image}
                  alt="Hero preview"
                  style={{ width: 120, borderRadius: 8, marginTop: 8 }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
            </div>

            <hr style={{ margin: "2rem 0", borderColor: "#e2e8f0" }} />

            {/* About Section */}
            <h4
              style={{
                fontWeight: 600,
                color: "#1e293b",
                marginBottom: "1rem",
                fontSize: "1rem",
              }}
            >
              About Section
            </h4>
            <div className="admin-form-group">
              <label>Title</label>
              <input
                className="admin-input"
                value={content.about_title}
                onChange={(e) =>
                  setContent({ ...content, about_title: e.target.value })
                }
              />
            </div>
            <div className="admin-form-group">
              <label>Paragraph 1</label>
              <textarea
                className="admin-input"
                value={content.about_text1}
                onChange={(e) =>
                  setContent({ ...content, about_text1: e.target.value })
                }
              />
            </div>
            <div className="admin-form-group">
              <label>Paragraph 2</label>
              <textarea
                className="admin-input"
                value={content.about_text2}
                onChange={(e) =>
                  setContent({ ...content, about_text2: e.target.value })
                }
              />
            </div>
            <div className="admin-form-group">
              <label>About Image</label>
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <input
                  className="admin-input"
                  value={content.about_image}
                  onChange={(e) =>
                    setContent({ ...content, about_image: e.target.value })
                  }
                  style={{ flex: 1 }}
                />
                <input
                  ref={uploadRefs.about}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) =>
                    handleImageUpload(e.target.files?.[0], "about_image")
                  }
                />
                <button
                  className="admin-btn admin-btn-gray"
                  onClick={() => uploadRefs.about.current?.click()}
                >
                  <FaUpload size={12} /> Upload
                </button>
              </div>
            </div>

            <hr style={{ margin: "2rem 0", borderColor: "#e2e8f0" }} />

            {/* Footer */}
            <h4
              style={{
                fontWeight: 600,
                color: "#1e293b",
                marginBottom: "1rem",
                fontSize: "1rem",
              }}
            >
              Footer
            </h4>
            <div className="admin-settings-grid">
              <div className="admin-form-group">
                <label>Brand Name</label>
                <input
                  className="admin-input"
                  value={content.footer_brand}
                  onChange={(e) =>
                    setContent({ ...content, footer_brand: e.target.value })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label>Tagline</label>
                <input
                  className="admin-input"
                  value={content.footer_tagline}
                  onChange={(e) =>
                    setContent({ ...content, footer_tagline: e.target.value })
                  }
                />
              </div>
            </div>

            <hr style={{ margin: "2rem 0", borderColor: "#e2e8f0" }} />

            {/* Social Links */}
            <h4
              style={{
                fontWeight: 600,
                color: "#1e293b",
                marginBottom: "1rem",
                fontSize: "1rem",
              }}
            >
              Social Links
            </h4>
            <div className="admin-settings-grid">
              {[
                { key: "social_instagram", label: "Instagram URL" },
                { key: "social_tiktok", label: "TikTok URL" },
                { key: "social_facebook", label: "Facebook URL" },
                { key: "social_whatsapp", label: "WhatsApp URL" },
              ].map((s) => (
                <div className="admin-form-group" key={s.key}>
                  <label>{s.label}</label>
                  <input
                    className="admin-input"
                    value={content[s.key]}
                    onChange={(e) =>
                      setContent({ ...content, [s.key]: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: "1rem 1.5rem",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              className="admin-btn admin-btn-blue"
              onClick={handleSave}
              disabled={saving}
            >
              <FaSave size={14} /> {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      )}

      {/* ── Theme Colors Tab ── */}
      {tab === "themes" && (
        <div className="admin-card">
          <div className="admin-card-body">
            {/* Theme selector */}
            <div
              style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}
            >
              {["classic", "midnight", "sunset"].map((t) => (
                <button
                  key={t}
                  className={`admin-btn ${activeTheme === t ? "admin-btn-blue" : "admin-btn-gray"}`}
                  onClick={() => setActiveTheme(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
              <button
                className="admin-btn admin-btn-gray"
                onClick={() => resetTheme(activeTheme)}
                style={{ marginLeft: "auto" }}
              >
                Reset to Default
              </button>
            </div>

            <div className="admin-settings-grid">
              {Object.entries(COLOR_LABELS).map(([key, label]) => (
                <div className="admin-form-group" key={key}>
                  <label>{label}</label>
                  <div className="admin-color-input">
                    <input
                      type="color"
                      value={themes[activeTheme][key] || "#000000"}
                      onChange={(e) =>
                        updateThemeColor(activeTheme, key, e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="admin-input"
                      value={themes[activeTheme][key] || ""}
                      onChange={(e) =>
                        updateThemeColor(activeTheme, key, e.target.value)
                      }
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Color Preview */}
            <div style={{ marginTop: "1.5rem" }}>
              <h4
                style={{
                  fontWeight: 600,
                  color: "#1e293b",
                  marginBottom: "0.75rem",
                }}
              >
                Preview
              </h4>
              <div
                style={{
                  background: themes[activeTheme].cafeBg,
                  color: themes[activeTheme].cafeText,
                  padding: "1.5rem",
                  borderRadius: "0.75rem",
                  border: `1px solid ${themes[activeTheme].cafeBorder}`,
                }}
              >
                <h3
                  style={{
                    color: themes[activeTheme].cafeAccent,
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                  }}
                >
                  Accent Heading
                </h3>
                <p style={{ marginBottom: "0.5rem" }}>
                  This is how regular text looks on the background.
                </p>
                <p
                  style={{
                    color: themes[activeTheme].cafeMuted,
                    marginBottom: "1rem",
                  }}
                >
                  This is muted text.
                </p>
                <div
                  style={{
                    background: themes[activeTheme].cafeSurface,
                    color: themes[activeTheme].cafeSurfaceText,
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    border: `1px solid ${themes[activeTheme].cafeBorder}`,
                  }}
                >
                  <span
                    style={{
                      color: themes[activeTheme].cafeAccent2,
                      fontWeight: 600,
                    }}
                  >
                    Surface card
                  </span>
                  <span
                    style={{
                      color: themes[activeTheme].cafeSurfaceMuted,
                      marginLeft: "1rem",
                    }}
                  >
                    muted text
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "1rem 1.5rem",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              className="admin-btn admin-btn-blue"
              onClick={handleSave}
              disabled={saving}
            >
              <FaSave size={14} /> {saving ? "Saving..." : "Save Theme"}
            </button>
          </div>
        </div>
      )}

      {/* ── Security Tab ── */}
      {tab === "security" && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>
              <FaKey size={14} style={{ display: "inline", marginRight: 8 }} />{" "}
              Change Password
            </h3>
          </div>
          <div className="admin-card-body">
            {pwStatus.msg && (
              <div
                className={`admin-alert ${pwStatus.type === "success" ? "admin-alert-success" : "admin-alert-error"}`}
              >
                {pwStatus.msg}
              </div>
            )}
            <form onSubmit={handlePasswordChange} style={{ maxWidth: 400 }}>
              <div className="admin-form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  className="admin-input"
                  value={pwForm.currentPassword}
                  onChange={(e) =>
                    setPwForm({ ...pwForm, currentPassword: e.target.value })
                  }
                  autoComplete="current-password"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>New Password</label>
                <input
                  type="password"
                  className="admin-input"
                  value={pwForm.newPassword}
                  onChange={(e) =>
                    setPwForm({ ...pwForm, newPassword: e.target.value })
                  }
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </div>
              <div className="admin-form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  className="admin-input"
                  value={pwForm.confirmPassword}
                  onChange={(e) =>
                    setPwForm({ ...pwForm, confirmPassword: e.target.value })
                  }
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </div>
              <button type="submit" className="admin-btn admin-btn-blue">
                <FaKey size={12} /> Change Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
