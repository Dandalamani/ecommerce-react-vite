import { FaUser, FaShoppingCart, FaBox, FaHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === "Escape") {
      setDrawerOpen(false);
    }
  };

  if (drawerOpen) {
    // 🔒 Lock background scroll (mobile + desktop)
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleEsc);
  } else {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  return () => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleEsc);
  };
}, [drawerOpen]);

  return (
    <>
      <header className="navbar">

        {/* ================= DESKTOP NAV ================= */}
        <div className="navbar-desktop">
          <Link to="/" className="logo">E-COMMERCE</Link>

          <input
            className="search-input"
            type="text"
            placeholder="Search for products, brands and more"
          />

          <div className="nav-links">
            <div className="login-dropdown">
              <Link
                to="/account"
                className="login-link"
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <FaUser /> Login
              </Link>

              <div className="dropdown-menu">
                <Link to="/wishlist">
                  <FaHeart style={{ marginRight: "4px" }} />
                    Wishlist
                </Link>
              </div>
            </div>

          <Link
            to="/cart"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <FaShoppingCart /> Cart
          </Link>

          <Link
            to="/orders"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <FaBox /> Orders
          </Link>
        </div>
</div>
        {/* ================= MOBILE NAV ================= */}
        <div className="navbar-mobile">
          <div className="mobile-top">
            <span
              className="menu-icon"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </span>

            <Link to="/" className="logo">E-COMMERCE</Link>

            <div className="nav-links">
              <Link to="/account" style={{ display: "flex", alignItems: "center", gap: "5px" }}><FaUser />Login</Link>
              <Link to="/cart" style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <FaShoppingCart />Cart</Link>
            </div>
          </div>

          <input
            className="search-input mobile-search"
            type="text"
            placeholder="Search for products, brands and more"
          />
        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      {drawerOpen && (
        <>
          <div
            className="drawer-overlay"
            onClick={() => setDrawerOpen(false)}
          />

          <aside className="mobile-drawer open">
            <div className="drawer-header">
              <span>Menu</span>
              <button
                className="drawer-close"
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
              >
                X
              </button>
            </div>

            <Link to="/orders" onClick={() => setDrawerOpen(false)}> <FaBox style={{ marginRight: "8px" }} /> Orders</Link>
            <Link to="/wishlist" onClick={() => setDrawerOpen(false)}><FaHeart style={{ marginRight: "8px" }} />Wishlist</Link>
            <Link to="/account" onClick={() => setDrawerOpen(false)}><FaUser style={{ marginRight: "8px" }} />Account</Link>
          </aside>
        </>
      )}
    </>
  );
}

export default Navbar;
