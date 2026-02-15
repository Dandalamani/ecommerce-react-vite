import React from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
function Wishlist() {
  const { wishlist, dispatchWishlist } = useWishlist();
  const { dispatch } = useCart();
  const { requireAuth } = useAuth();
  const removeFromWishlist = (item) => {
    dispatchWishlist({ type: "REMOVE_FROM_WISHLIST", payload: item });
  };
  const moveToCart = (item) => {
    if (!requireAuth("move items to cart")) return;
    // 1️⃣ Add to cart
    dispatch({ type: "ADD_TO_CART", payload: { ...item, quantity: 1 } });
    // 2️⃣ Remove from wishlist
    dispatchWishlist({ type: "REMOVE_FROM_WISHLIST", payload: item });
    toast.success(`Moved "${item.title}" to cart 🛒`);
  };
  const clearWishlist = () => {
    dispatchWishlist({ type: "CLEAR_WISHLIST" });
  };
  return (
    <div style={{ padding: "2rem" }}>
      <h2>❤️ Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <>

          <div className="wishlist-container">
            {wishlist.map((item) => (
              <div key={item.id} className="wishlist-card">
                <div className="wishlist-card-content">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="wishlist-image"
                  />

                  <h4 className="wishlist-title">{item.title}</h4>
                  <p className="wishlist-price">₹{item.price}</p>
                </div>

                <div className="wishlist-buttons">
                  <button
                    onClick={() => moveToCart(item)}
                    className="wishlist-move-btn"
                  >
                    Move to Cart 🛒
                  </button>

                  <button
                    onClick={() => removeFromWishlist(item)}
                    className="wishlist-remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              onClick={clearWishlist}
              style={{
                backgroundColor: "#333",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Clear Wishlist
            </button>
          </div>
        </>
      )}
    </div>
  );
}
export default Wishlist;