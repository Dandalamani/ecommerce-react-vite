import { FaUser, FaShoppingCart, FaBox, FaHeart, FaSignOutAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated, user, logout } = useAuth();
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/products?search=${encodeURIComponent(search)}`);
    setSearch("");
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };

    if (drawerOpen) {
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

          {/* 🔍 SEARCH */}
          <form onSubmit={handleSearch} style={{ flex: 1 }}>
            <input
              className="search-input"
              type="text"
              placeholder="Search for products, brands and more"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
              if (e.key === "Enter" && search.trim()) {
                navigate(`/products?search=${search}`);
              }
            }}
            />
          </form>

          <div className="nav-links">

            {/* 🔐 LOGIN / PROFILE */}
            <div className="login-dropdown">

              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="login-link"
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <FaUser /> Login
                </Link>
              ) : (
                <span
                  className="login-link"
                  style={{ display: "flex", alignItems: "center", gap: "6px", color: "white" }}
                >
                  <FaUser /> Hi, {user?.name?.length > 5 
  ? user.name.slice(0, 5) + ".." 
  : user?.name || "User"}
                </span>
              )}

              {/* 👇 Dropdown (COMMON before & after login) */}
              <div className="dropdown-menu">
                <Link to="/wishlist">
                  <FaHeart /> Wishlist
                </Link>

                {isAuthenticated && (
                  <>
                    <Link to="/account">
                      <FaUser /> My Profile
                    </Link>

                    <Link to="/orders">
                      <FaBox /> Orders
                    </Link>

                    <a
                      onClick={logout}
                      style={{ cursor: "pointer" }}
                    >
                      <FaSignOutAlt /> Logout
                    </a>
                  </>
                )}
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
            >
              ☰
            </span>

            <Link to="/" className="logo">E-COMMERCE</Link>

            <div className="nav-links">
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <FaUser /> Login
                </Link>
              ) : (
                <Link
                  to="/account"
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <FaUser />
<span className="user-name">
  Hi, {(user?.name || "Profile").slice(0, 5)}
</span>
                </Link>
              )}

              <Link
                to="/cart"
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <FaShoppingCart /> Cart
              </Link>
            </div>
          </div>

          {/* 🔍 MOBILE SEARCH */}
          <form onSubmit={handleSearch}>
            <input
              className="search-input mobile-search"
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

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
                onClick={() => setDrawerOpen(false)}
              >
                X
              </button>
            </div>

            <Link to="/wishlist" onClick={() => setDrawerOpen(false)}>
              <FaHeart /> Wishlist
            </Link>

            <Link to="/orders" onClick={() => setDrawerOpen(false)}>
              <FaBox /> Orders
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/account" onClick={() => setDrawerOpen(false)}>
                  <FaUser /> Account
                </Link>

                <a
                  onClick={() => {
                    logout();
                    setDrawerOpen(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <FaSignOutAlt /> Logout
                </a>
              </>
            ) : (
              <Link to="/login" onClick={() => setDrawerOpen(false)}>
                <FaUser /> Login
              </Link>
            )}
          </aside>
        </>
      )}
    </>
  );
}

export default Navbar;
