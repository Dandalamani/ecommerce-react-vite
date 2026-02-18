import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Dashboard() {
  const { user } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const orders =
    JSON.parse(localStorage.getItem(`orders_${user?.id}`)) || [];

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>👋 Welcome, {user?.name}</h2>

      {/* STATS */}
      <div style={{ display: "flex", gap: "20px", marginTop: "1rem" }}>
        <Card title="Orders" value={orders.length} />
        <Card title="Wishlist" value={wishlist.length} />
        <Card title="Cart Items" value={cart.length} />
        <Card title="Total Spent" value={`₹${totalSpent}`} />
      </div>

      {/* RECENT ORDERS */}
      <h3 style={{ marginTop: "2rem" }}>Recent Orders</h3>
      {orders.slice(0, 3).map((order) => (
        <div key={order.id} style={orderBox}>
          <p><strong>{order.id}</strong></p>
          <p>{new Date(order.date).toLocaleDateString()}</p>
          <p>₹{order.total}</p>
        </div>
      ))}
    </div>
  );
}

const Card = ({ title, value }) => (
  <div style={{
    flex: 1,
    background: "white",
    padding: "1rem",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  }}>
    <h4>{title}</h4>
    <h2>{value}</h2>
  </div>
);

const orderBox = {
  background: "#fff",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px"
};

export default Dashboard;
