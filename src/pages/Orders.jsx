import React, { useEffect, useState } from "react";
function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
  }, []);
  const fmt = (v) => `₹${v.toFixed(2)}`;
  // ✅ Cancel order handler
  const handleCancelOrder = (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: "cancelled" } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    alert("❌ Order cancelled successfully!");
  };
  return (
    <div
      style={{
        padding: "2rem",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        background: "#f9fafc",
        color: "#333",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>📦 My Orders</h2>
      {orders.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "3rem", color: "#555" }}>
          You haven’t placed any orders yet.
        </p>
      ) : (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "white",
                borderRadius: "10px",
                boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
                padding: "1.5rem",
                marginBottom: "1.2rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 0.4rem" }}>Order ID: {order.id}</h3>
                  <p style={{ margin: 0, color: "#777" }}>
                    Placed on: {new Date(order.date).toLocaleString()}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      margin: 0,
                      color:
                        order.status === "paid"
                          ? "green"
                          : order.status === "cancelled"
                          ? "red"
                          : "orange",
                      fontWeight: "bold",
                    }}
                  >
                    {order.status === "paid"
                      ? "✅ Paid"
                      : order.status === "cancelled"
                      ? "❌ Cancelled"
                      : "🕓 Processing"}
                  </p>
                  <p style={{ margin: 0 }}>
                    Total: <strong>{fmt(order.total)}</strong>
                  </p>
                </div>
              </div>
              <hr style={{ margin: "1rem 0", borderColor: "#eee" }} />
              <p style={{ margin: 0 }}>
                Payment Method:{" "}
                <strong style={{ textTransform: "uppercase" }}>
                  {order.paymentMethod}
                </strong>
              </p>

              <details style={{ marginTop: "1rem" }}>
                <summary
                  style={{
                    cursor: "pointer",
                    color: "#007bff",
                    fontWeight: "bold",
                    userSelect: "none",
                  }}
                >
                  View Items ({order.items.length})
                </summary>
                <ul style={{ marginTop: "0.5rem" }}>
                  {order.items.map((item, i) => (
                    <li key={i} style={{ marginBottom: "5px" }}>
                      {item.title} × {item.quantity} —{" "}
                      <strong>{fmt(item.price)}</strong>
                    </li>
                  ))}
                </ul>
              </details>
              {/* ✅ Cancel button (only if not cancelled) */}
              {order.status !== "cancelled" && (
                <button
                  onClick={() => handleCancelOrder(order.id)}
                  style={{
                    marginTop: "1rem",
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "8px 15px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  ❌ Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default Orders;