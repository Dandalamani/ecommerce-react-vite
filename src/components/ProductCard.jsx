import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "react-toastify";

function ProductCard({ product, addToCart }) {
  const { wishlist, dispatchWishlist } = useWishlist();
  const { cart } = useCart(); // 👈 cart state
  const isInWishlist = wishlist.some((item) => item.id === product.id);
  const isInCart = cart.some((item) => item.id === product.id); // 👈 check cart

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
    if (isInCart) return; // 🔕 prevent duplicate + toast
    addToCart(product);
    toast("✔ Product added to cart");
  };

  return (
    <div className="product-card">
      {/* IMAGE + TITLE */}
      <Link
        to={`/products/${product.id}`}
        className="product-link"
      >
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
        />

        <h3 className="product-title">
          {product.title}
        </h3>
      </Link>

      {/* PRICE */}
      <p className="product-price">₹{product.price}</p>

      {/* ACTION BUTTONS */}
      <div className="product-actions">
        <div className="tooltip-wrapper">
        <button
          onClick={handleAddToCart}
          className="btn-cart"
          disabled={isInCart}
          style={{
            cursor: isInCart ? "not-allowed" : "pointer",
            opacity: isInCart ? 0.7
             : 1,
          }}
        >
          {isInCart ? "In Cart" : "Add to Cart"}
        </button>
        {/* 🔔 Tooltip */}
        {isInCart && <span className="tooltip-text">Already in cart</span>}
      </div>
        <button
          onClick={toggleWishlist}
          className={`btn-wishlist ${isInWishlist ? "remove" : ""}`}
        >
          {isInWishlist ? "Remove" : "Wishlist"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
