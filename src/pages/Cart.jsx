import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
/**
 * Updated Cart page with:
 * - Subtotal, discounts, coupon, shipping, tax
 * - Fake payment UI (Card / UPI / COD)
 * - Simulated processing and order confirmation
 * - Orders saved to localStorage under "orders"
 */

function Cart() {
  const { cart, dispatch } = useCart();
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const { requireAuth } = useAuth();
  const userId = JSON.parse(localStorage.getItem("user"))?.user?.id;
  const [cardForm, setCardForm] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  // Basic calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // volume discount: 10% if subtotal > 1000
  const volumeDiscount = subtotal > 1000 ? subtotal * 0.1 : 0;
  // coupon logic (example): SAVE50 => flat ₹50 off
  const couponValue = appliedCoupon === "SAVE50" ? 50 : 0;
  // shipping
  const shipping = subtotal > 1999 ? 0 : cart.length === 0 ? 0 : 49;
  // tax (GST) 18% on (subtotal - discounts)
  const taxableAmount = Math.max(0, subtotal - volumeDiscount - couponValue);
  const tax = taxableAmount * 0.18;
  const total = Math.max(0, taxableAmount + tax + shipping);
  // Helpers
  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return alert("Enter a coupon code.");
    if (code === "SAVE50") {
      setAppliedCoupon(code);
      alert("Coupon applied: ₹50 off");
    } else {
      alert("Invalid coupon code.");
      setAppliedCoupon(null);
    }
  };
  const removeFromCart = (item) => {
    if (!requireAuth("remove items from cart")) return;
    dispatch({ type: "REMOVE_FROM_CART", payload: item });
  };
  const increaseQty = (item) => {
    if (!requireAuth("update cart items")) return;
    dispatch({ type: "INCREASE_QTY", payload: item });
  };
  const decreaseQty = (item) => {
    if (!requireAuth("update cart items")) return;
    dispatch({ type: "DECREASE_QTY", payload: item });
  };
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };
  // Format currency helpers
  const fmt = (v) => `₹${v.toFixed(2)}`;
  // simple card input handler
  const handleCardChange = (e) => {
    setCardForm({ ...cardForm, [e.target.name]: e.target.value });
  };
  // Simulate payment & create order
  const placeOrder = (e) => {
    e.preventDefault();
    if (!requireAuth("place an order")) return;
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    if (cart.length === 0) return alert("Your cart is empty.");
    // For card payments, do a little validation
    if (paymentMethod === "card") {
      const { name, number, expiry, cvv } = cardForm;
      if (!name || !number || !expiry || !cvv) {
        toast.error("Please fill all card details");
        return;
      }
      if (!/^\d{12,19}$/.test(number.replace(/\s+/g, ""))) {
        toast.error("Enter a valid card number (12–19 digits)");
        return;
      }
    }
    // Build order object
    const order = {
      id: "ORD" + Date.now(),
      date: new Date().toISOString(),
      items: cart.map((i) => ({ id: i.id, title: i.title, price: i.price, quantity: i.quantity })),
      subtotal,
      volumeDiscount,
      coupon: appliedCoupon || null,
      couponValue,
      shipping,
      tax,
      total,
      paymentMethod,
      status: "processing",
    };
    // Start simulated processing
    setProcessing(true);
    // Simulated async payment (use setTimeout in client-side code)
    setTimeout(() => {
      // Mark as success
      order.status = "paid";
      order.paymentDetails = paymentMethod === "card"
        ? { brand: "VISA/MASTERCARD (simulated)", last4: cardForm.number.slice(-4) }
        : { info: paymentMethod === "upi" ? "UPI (simulated)" : "Cash on Delivery" };
      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem(`orders_${userId}`) || "[]");
      existingOrders.unshift(order);
      localStorage.setItem(`orders_${userId}`, JSON.stringify([...existingOrders]));
      // Clear cart
      clearCart();
      setOrderResult(order);
      setProcessing(false);
      // Reset some local UI state
      setAppliedCoupon(null);
      setCoupon("");
      setCardForm({ name: "", number: "", expiry: "", cvv: "" });
      toast.success("Payment successful! Order placed 🎉");
    }, 1500); // 1.5s simulated processing
  };
  return (
    <div style={{ padding: "2rem" }}>
      <h2>🛒 Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {/* LEFT: Cart items */}
            <div style={{ flex: 1, minWidth: "320px" }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="cart-item"
                >
                  <div className="cart-item-left">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="cart-item-image"
                    />
                    <div className="cart-item-info">
                      <h4>{item.title}</h4>
                      <p>₹{item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <button onClick={() => decreaseQty(item)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item)}>+</button>
                    <button
                      className="cart-remove"
                      onClick={() => removeFromCart(item)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* RIGHT: Order summary + payment */}
            <aside style={{ width: "360px", minWidth: "280px" }}>
              <div style={{ padding: "1rem", borderRadius: "8px", background: "white", boxShadow: "0 4px 10px rgba(87, 56, 56, 0.05)" }}>
                <h3>Order Summary</h3>
                <div style={summaryRowStyle}><span>Subtotal</span><strong>{fmt(subtotal)}</strong></div>
                <div style={summaryRowStyle}><span>Volume Discount</span><span>- {fmt(volumeDiscount)}</span></div>
                <div style={summaryRowStyle}><span>Coupon</span><span>- {fmt(couponValue)}</span></div>
                <div style={summaryRowStyle}><span>Tax (18%)</span><strong>{fmt(tax)}</strong></div>
                <div style={summaryRowStyle}><span>Shipping</span><strong>{shipping === 0 ? "Free" : fmt(shipping)}</strong></div>
                <hr />
                <div style={summaryRowStyle}><span style={{ fontSize: "1.1rem" }}>Total</span><strong style={{ fontSize: "1.1rem" }}>{fmt(total)}</strong></div>
                {/* Coupon input */}
                <div style={{ marginTop: "1rem", display: "flex", gap: "9px" }}>
                  <input
                    placeholder="Enter coupon (e.g. SAVE50)"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                  <button onClick={applyCoupon} style={{ padding: "8px 12px", borderRadius: "6px", background: "#007bff", color: "white", border: "none" }}>
                    Apply
                  </button>
                </div>
                {/* Payment method selector */}
                <div style={{ marginTop: "1rem" }}>
                  <h4 style={{ marginBottom: "8px" }}>Payment</h4>
                  <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
                    <label style={radioLabelStyle}>
                      <input type="radio" name="payment" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                      <span style={{ marginLeft: "8px" }}>Card (Simulated)</span>
                    </label>
                    <label style={radioLabelStyle}>
                      <input type="radio" name="payment" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} />
                      <span style={{ marginLeft: "8px" }}>UPI (Simulated)</span>
                    </label>
                    <label style={radioLabelStyle}>
                      <input type="radio" name="payment" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                      <span style={{ marginLeft: "8px" }}>Cash on Delivery</span>
                    </label>
                  </div>
                </div>
                {/* Fake payment UI */}
                {paymentMethod === "card" && (
                  <form onSubmit={placeOrder} style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "9px" }}>
                    <input name="name" value={cardForm.name} onChange={handleCardChange} placeholder="Name on card" style={inputSmallStyle} />
                    <input name="number" value={cardForm.number} onChange={handleCardChange} placeholder="Card number (digits only)" style={inputSmallStyle} />
                    <div style={{ display: "flex", gap: "9px" }}>
                      <input name="expiry" value={cardForm.expiry} onChange={handleCardChange} placeholder="MM/YY" style={{ ...inputSmallStyle, flex: 1 }} />
                      <input name="cvv" value={cardForm.cvv} onChange={handleCardChange} placeholder="CVV" style={{ ...inputSmallStyle, width: "100px" }} />
                    </div>
                    <button type="submit" disabled={processing} style={payButtonStyle}>
                      {processing ? "Processing..." : `Pay ${fmt(total)}`}
                    </button>
                  </form>
                )}
                {paymentMethod === "upi" && (
                  <div style={{ marginTop: "1rem" }}>
                    <p>Scan the QR or enter UPI ID in your app (simulated).</p>
                    <button onClick={placeOrder} disabled={processing} style={payButtonStyle}>
                      {processing ? "Processing..." : `Pay ${fmt(total)} via UPI`}
                    </button>
                  </div>
                )}
                {paymentMethod === "cod" && (
                  <div style={{ marginTop: "1rem" }}>
                    <p>You'll pay when the delivery arrives.</p>
                    <button onClick={placeOrder} disabled={processing} style={payButtonStyle}>
                      {processing ? "Processing..." : "Place Order (COD)"}
                    </button>
                  </div>
                )}
                <div style={{ marginTop: "1rem", display: "flex", gap: "8px" }}>
                  <button onClick={() => dispatch({ type: "CLEAR_CART" })} style={{ flex: 1, padding: "8px", borderRadius: "6px", background: "#e41515", color: "white", border: "none" }}>
                    Clear Cart
                  </button>
                  <button onClick={() => {
                    // Quick: save cart as draft order locally (not required)
                    const draft = { id: "DRAFT" + Date.now(), items: cart, subtotal, savedAt: new Date().toISOString() };
                    localStorage.setItem("draftOrder", JSON.stringify(draft));
                    toast.success("Draft saved locally.");
                  }} style={{ padding: "8px", color: "white", borderRadius: "6px", background: "#1a4bed", border: "1px solid #ccc" }}>
                    Save Draft
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </>
      )}
      {/* Order confirmation */}
      {orderResult && (
        <div style={{ marginTop: "2rem", background: "#e6ffed", padding: "1rem", borderRadius: "8px", border: "1px solid #b7f0c2" }}>
          <h3>✅ Order Confirmed</h3>
          <p>Order ID: <strong>{orderResult.id}</strong></p>
          <p>Status: <strong>{orderResult.status}</strong></p>
          <p>Payment: <strong>{orderResult.paymentMethod}</strong> {orderResult.paymentDetails?.last4 ? `(••••${orderResult.paymentDetails.last4})` : ""}</p>
          <p>Total paid: <strong>{fmt(orderResult.total)}</strong></p>
          <details style={{ marginTop: "8px" }}>
            <summary>View items</summary>
            <ul>
              {orderResult.items.map((it) => (
                <li key={it.id}>{it.title} × {it.quantity} — {fmt(it.price)}</li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
}
/* Styles */
const qtyButtonStyle = {
  background: "#eee",
  color: "#000",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};
const removeButtonStyle = {
  backgroundColor: "#ff4d4d",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};
const summaryRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "8px",
};
const radioLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
};
const inputSmallStyle = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "100%",
};
const payButtonStyle = {
  marginTop: "8px",
  padding: "10px 12px",
  background: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  width: "100%",
};
export default Cart;