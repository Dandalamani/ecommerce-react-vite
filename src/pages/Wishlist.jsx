import React from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
function Wishlist() {
  const { wishlist, dispatchWishlist } = useWishlist();
  const { dispatch } = useCart();
  const removeFromWishlist = (item) => {
    dispatchWishlist({ type: "REMOVE_FROM_WISHLIST", payload: item });
  };
  const moveToCart = (item) => {
    // 1️⃣ Add to cart
    dispatch({ type: "ADD_TO_CART", payload: { ...item, quantity: 1 } });
    // 2️⃣ Remove from wishlist
    dispatchWishlist({ type: "REMOVE_FROM_WISHLIST", payload: item });
    alert(`Moved "${item.title}" to cart 🛒`);
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
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.5rem",
              justifyContent: "center",
              marginTop: "2rem",
            }}
          >
            {wishlist.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                  width: "220px",
                  textAlign: "center",
                  background: "white",
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                    marginBottom: "10px",
                  }}
                />
                <h4 style={{ fontSize: "0.9rem", marginBottom: "10px" }}>
                  {item.title}
                </h4>
                <p>₹{item.price}</p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={() => moveToCart(item)}
                    style={{
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Move to Cart 🛒
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item)}
                    style={{
                      backgroundColor: "#ff4d4d",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Remove 💔
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