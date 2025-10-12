import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "react-toastify";

function ProductCard({ product, addToCart }) {
  const { wishlist, dispatchWishlist } = useWishlist();
  const isInWishlist = wishlist.some((item) => item.id === product.id);

  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatchWishlist({ type: "REMOVE_FROM_WISHLIST", payload: product });
      toast.info(`Removed "${product.title}" from wishlist ❤️`);
    } else {
      dispatchWishlist({ type: "ADD_TO_WISHLIST", payload: product });
      toast.success(`Added "${product.title}" to wishlist ❤️`);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`Added "${product.title}" to cart 🛒`);
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        margin: "10px",
        width: "220px",
        textAlign: "center",
        background: "white",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <Link
        to={`/products/${product.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img
          src={product.image}
          alt={product.title}
          style={{
            height: "150px",
            width: "100%",
            objectFit: "contain",
            marginBottom: "10px",
          }}
        />
        <h3
          style={{
            fontSize: "1rem",
            height: "40px",
            overflow: "hidden",
          }}
        >
          {product.title}
        </h3>
      </Link>
      <p style={{ fontWeight: "bold" }}>₹{product.price}</p>
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button
          onClick={handleAddToCart}
          style={{
            padding: "6px 12px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add to Cart
        </button>
        <button
          onClick={toggleWishlist}
          style={{
            padding: "6px 12px",
            background: isInWishlist ? "#ff4d4d" : "#ff85a2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isInWishlist ? "💔 Remove" : "❤️ Wishlist"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
