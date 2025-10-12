import { Link } from "react-router-dom";
function Navbar() {
  const linkStyle = { color: "white", textDecoration: "none" };
  const hoverStyle = { textDecoration: "underline" };
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#1e90ff",
        color: "white",
      }}
    >
      <h1>E-Commerce</h1>
      <ul
        style={{
          display: "flex",
          gap: "15px",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        <li>
          <Link to="/" style={linkStyle}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/products" style={linkStyle}>
            Products
          </Link>
        </li>
        <li>
          <Link to="/wishlist" style={linkStyle}>
            Wishlist
          </Link>
        </li>
        <li>
          <Link to="/cart" style={linkStyle}>
            Cart
          </Link>
        </li>
        <li>
          <Link to="/orders" style={linkStyle}>
            Orders
          </Link>
        </li> {/* ✅ Added Orders link */}
        <li>
          <Link to="/account" style={linkStyle}>
            Account
          </Link>
        </li>
      </ul>
    </nav>
  );
}
export default Navbar;