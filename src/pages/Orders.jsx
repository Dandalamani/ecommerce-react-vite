import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const lockScroll = () => {
  document.body.style.overflow = "hidden";
};
const unlockScroll = () => {
  document.body.style.overflow = "";
};
function Orders() {
  const [orders, setOrders] = useState([]);
  const { user, isAuthenticated } = useAuth();

if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
  const [cancelOrderId, setCancelOrderId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
const userId = user?.email;
const savedOrders  = JSON.parse(localStorage.getItem(`orders_${userId}`)) || [];
    setOrders(savedOrders);
    return () => {
      unlockScroll();
    };
  }, []);

  const fmt = (v) => `₹${v.toFixed(2)}`;

  return (
    <div
      style={{
        padding: "2rem",
        minHeight: "100vh",
        background: "#f9fafc",
        color: "#333",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        📦 My Orders
      </h2>

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
                  <h3 style={{ margin: "0 0 0.4rem" }}>
                    Order ID: {order.id}
                  </h3>
                  <p style={{ margin: 0, color: "#777" }}>
                    Placed on: {new Date(order.date).toLocaleString()}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: "bold",
                      color:
                        order.status === "paid"
                          ? "green"
                          : order.status === "cancelled"
                          ? "red"
                          : "orange",
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

              {order.status !== "cancelled" && (
                <button
                  onClick={() => {
                    lockScroll();
                    setCancelOrderId(order.id);
                  }}
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

      {/* ================= CANCEL CONFIRM MODAL ================= */}
      {cancelOrderId && (
        <div
          className="cancel-overlay"
          onClick={() => {
            setCancelOrderId(null);
            unlockScroll();
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            className="cancel-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
              minWidth: "300px",
            }}
          >

            <strong>Are you sure, you want to cancel this order?</strong>

            <div className="cancel-actions">
              <button
                className="yes"
                onClick={() => {
                  const updatedOrders = orders.map((o) =>
                    o.id === cancelOrderId
                      ? { ...o, status: "cancelled" }
                      : o
                  );
                  setOrders(updatedOrders);
                  const userData = JSON.parse(localStorage.getItem("user"));
                  const userId = userData?.email;

                  localStorage.setItem(
                    `orders_${userId}`,
                    JSON.stringify(updatedOrders)
                  );

                  // ✅ FIX: CLOSE MODAL PROPERLY
                  setTimeout(() => {
                    setCancelOrderId(null);
                    unlockScroll();
                  }, 0);

                  toast.success("Order cancelled successfully", {
                    position: "bottom-center",
                  });
                }}
              >
                Yes, Cancel
              </button>

              <button
                className="no"
                onClick={() => {
                  setCancelOrderId(null);
                  unlockScroll();
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
