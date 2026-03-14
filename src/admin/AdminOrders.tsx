import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function AdminOrders({ csrfToken }: { csrfToken?: string }) {
  type OrderItem = { name?: string; quantity?: number; unit_price?: number };
  type Order = { id: number; customer_name?: string; customer_phone?: string; total_amount?: number; created_at?: string; notes?: string; items?: OrderItem[] };
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchOrders = async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders.php?page=${p}&limit=15`, {
        credentials: "include",
      });
      const data = await res.json();
      setOrders(data.data || []);
      setTotalPages(data.pages || 1);
      setPage(data.page || 1);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3>Orders</h3>
        <button
          className="admin-btn admin-btn-gray"
          onClick={() => fetchOrders(page)}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
          No orders yet
        </div>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <>
                    <tr key={order.id}>
                      <td style={{ fontWeight: 600 }}>{order.id}</td>
                      <td>{order.customer_name || "—"}</td>
                      <td>{order.customer_phone || "—"}</td>
                      <td style={{ fontWeight: 600 }}>
                        ${Number(order.total_amount).toFixed(2)}
                      </td>
                      <td style={{ fontSize: "0.8rem", color: "#64748b" }}>
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                      <td>
                        <button
                          className="admin-btn admin-btn-sm admin-btn-gray"
                          onClick={() => toggleExpand(order.id)}
                        >
                          {expandedId === order.id ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr key={`${order.id}-detail`}>
                        <td
                          colSpan={6}
                          style={{
                            background: "#f8fafc",
                            padding: "1rem 1.5rem",
                          }}
                        >
                          {order.notes && (
                            <p
                              style={{
                                marginBottom: "0.5rem",
                                color: "#475569",
                                fontSize: "0.85rem",
                              }}
                            >
                              <strong>Notes:</strong> {order.notes}
                            </p>
                          )}
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "0.5rem",
                            }}
                          >
                            {(order.items || []).map(
                              (item: any, idx: number) => (
                                <span
                                  key={idx}
                                  className="admin-badge admin-badge-blue"
                                  style={{ fontSize: "0.75rem" }}
                                >
                                  {item.name || "Item"} x{item.quantity} — $
                                  {Number(item.unit_price).toFixed(2)}
                                </span>
                              ),
                            )}
                            {(!order.items || order.items.length === 0) && (
                              <span
                                style={{ color: "#94a3b8", fontSize: "0.8rem" }}
                              >
                                No item details
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div
              style={{
                padding: "1rem 1.5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <button
                className="admin-btn admin-btn-gray admin-btn-sm"
                onClick={() => fetchOrders(page - 1)}
                disabled={page <= 1}
              >
                <FaChevronLeft size={12} /> Prev
              </button>
              <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                Page {page} of {totalPages}
              </span>
              <button
                className="admin-btn admin-btn-gray admin-btn-sm"
                onClick={() => fetchOrders(page + 1)}
                disabled={page >= totalPages}
              >
                Next <FaChevronRight size={12} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
