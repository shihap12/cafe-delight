import { useState, useEffect, useRef } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUpload } from "react-icons/fa";

export default function AdminProducts({ csrfToken }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products.php", {
        credentials: "include",
      });
      const data = await res.json();
      setProducts(data.data || []);
    } catch {
      setStatus({ type: "error", msg: "Failed to load products" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (product) => {
    if (!confirm(`Delete "${product.name}"?`)) return;

    try {
      const res = await fetch("/api/admin/products.php", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ id: product.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", msg: data.error || "Delete failed" });
        return;
      }
      setStatus({ type: "success", msg: `"${product.name}" deleted` });
      fetchProducts();
    } catch {
      setStatus({ type: "error", msg: "Connection error" });
    }
  };

  const openEdit = (product) => {
    setEditing(product);
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleSaved = () => {
    setModalOpen(false);
    fetchProducts();
  };

  const filtered = products.filter((p) => {
    if (filter !== "All" && p.category !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div>
      {status.msg && (
        <div
          className={`admin-alert ${status.type === "success" ? "admin-alert-success" : "admin-alert-error"}`}
        >
          {status.msg}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Menu Products ({products.length})</h3>
          <button className="admin-btn admin-btn-blue" onClick={openAdd}>
            <FaPlus size={12} /> Add Product
          </button>
        </div>

        {/* Filters */}
        <div
          style={{
            padding: "1rem 1.5rem",
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <FaSearch
              size={14}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            />
            <input
              type="text"
              className="admin-input"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 34 }}
            />
          </div>
          {["All", "Drinks", "Desserts"].map((cat) => (
            <button
              key={cat}
              className={`admin-btn ${filter === cat ? "admin-btn-blue" : "admin-btn-gray"}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div
            style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}
          >
            Loading...
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        padding: "2rem",
                        color: "#94a3b8",
                      }}
                    >
                      No products found
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </td>
                      <td style={{ fontWeight: 500 }}>{p.name}</td>
                      <td>
                        <span
                          className={`admin-badge ${p.category === "Drinks" ? "admin-badge-blue" : "admin-badge-amber"}`}
                        >
                          {p.category}
                        </span>
                      </td>
                      <td>${Number(p.price).toFixed(2)}</td>
                      <td>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button
                            className="admin-btn admin-btn-sm admin-btn-blue"
                            onClick={() => openEdit(p)}
                            title="Edit"
                          >
                            <FaEdit size={12} />
                          </button>
                          <button
                            className="admin-btn admin-btn-sm admin-btn-red"
                            onClick={() => handleDelete(p)}
                            title="Delete"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {modalOpen && (
        <ProductModal
          product={editing}
          csrfToken={csrfToken}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

/* ── Product Add/Edit Modal ── */
function ProductModal({ product, csrfToken, onClose, onSaved }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category: product?.category || "Drinks",
    image: product?.image || "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Image too large. Max 5 MB.");
      return;
    }

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",
    ];
    if (!allowed.includes(file.type)) {
      setError("Invalid image type.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("image", file);

      const res = await fetch("/api/admin/upload.php", {
        method: "POST",
        headers: { "X-CSRF-Token": csrfToken },
        credentials: "include",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }

      handleChange("image", data.path);
    } catch {
      setError("Upload connection error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = isEdit ? { ...form, id: product.id } : form;
    payload.price = parseFloat(payload.price) || 0;

    try {
      const res = await fetch("/api/admin/products.php", {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        const msgs = data.errors?.join(", ") || data.error || "Save failed";
        setError(msgs);
        return;
      }

      onSaved();
    } catch {
      setError("Connection error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{isEdit ? "Edit Product" : "Add Product"}</h3>
          <button
            className="admin-btn admin-btn-sm admin-btn-gray"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            {error && (
              <div className="admin-alert admin-alert-error">{error}</div>
            )}

            <div className="admin-form-group">
              <label>Name</label>
              <input
                className="admin-input"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Product name"
                required
                maxLength={255}
              />
            </div>

            <div className="admin-form-group">
              <label>Description</label>
              <textarea
                className="admin-input"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Product description"
                required
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label>Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="admin-input"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="admin-form-group" style={{ flex: 1 }}>
                <label>Category</label>
                <select
                  className="admin-input"
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                >
                  <option value="Drinks">Drinks</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label>Image</label>
              <input type="hidden" value={form.image} />

              <div
                className="admin-upload-zone"
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                  onChange={handleUpload}
                  style={{ display: "none" }}
                />
                {uploading ? (
                  <p style={{ color: "#3b82f6" }}>Uploading...</p>
                ) : form.image ? (
                  <div>
                    <img
                      src={form.image}
                      alt="Preview"
                      className="admin-upload-preview"
                    />
                    <p
                      style={{
                        marginTop: 8,
                        color: "#64748b",
                        fontSize: "0.8rem",
                      }}
                    >
                      Click to change image
                    </p>
                  </div>
                ) : (
                  <div>
                    <FaUpload
                      size={24}
                      style={{ color: "#94a3b8", marginBottom: 8 }}
                    />
                    <p style={{ color: "#64748b" }}>Click to upload image</p>
                    <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                      JPG, PNG, WebP, AVIF (max 5MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Or enter URL manually */}
              <input
                className="admin-input"
                value={form.image}
                onChange={(e) => handleChange("image", e.target.value)}
                placeholder="Or enter image path: /images/file.jpg"
                style={{ marginTop: "0.5rem" }}
              />
            </div>
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="admin-btn admin-btn-gray"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-blue"
              disabled={saving}
            >
              {saving ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
