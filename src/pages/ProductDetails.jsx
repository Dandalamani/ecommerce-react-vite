import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]); // ✅ FIXED

  const { cart, dispatch } = useCart();
  const { requireAuth } = useAuth();

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ Fetch Product Details
  useEffect(() => {
    setLoading(true);

    axios.get(`${API}/api/products/${id}`)
      .then(res => {
        const found = res.data.find((p) => String(p.id) === String(id));

        if (found) {
          setProduct(found);
        } else {
          console.error("❌ Product not found");
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

  }, [id, API]);

  // ✅ Fetch Recommendations from FastAPI
  useEffect(() => {
  if (!product) return;

  fetch(`http://localhost:8000/recommend?category=${product.category}`)
    .then(res => res.json())
    .then(data => setRecommendations(data))
    .catch(err => console.error("Recommendation error:", err));

}, [product]);

  const isInCart = cart.some((item) => item.id === product?.id);

  const addToCart = () => {
    if (!requireAuth("add items to cart")) return;
    if (isInCart) return;

    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, quantity: 1 },
    });
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;
  if (!product) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Product not found!</p>;

  return (
    <div style={{ maxWidth: "1000px", margin: "2rem auto", padding: "1rem", fontFamily: "Arial" }}>
      
      {/* PRODUCT DETAILS */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center" }}>
        <img
          src={product.image}
          alt={product.title}
          style={{ width: "300px", height: "300px", objectFit: "contain", border: "1px solid #ddd", borderRadius: "10px" }}
        />

        <div style={{ flex: 1 }}>
          <h2>{product.title}</h2>
          <p style={{ color: "#555" }}>{product.description}</p>
          <h3 style={{ color: "#007bff" }}>₹{product.price}</h3>
          <p><strong>Category:</strong> {product.category}</p>

          <button
            onClick={addToCart}
            style={{
              marginTop: "1rem",
              padding: "10px 20px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: isInCart ? "not-allowed" : "pointer",
            }}
          >
            {isInCart ? "In Cart" : "Add to Cart"}
          </button>

          {isInCart && (
            <p style={{ color: "#28a745", marginTop: "8px" }}>
              ✔ Already added to cart
            </p>
          )}

          <div style={{ marginTop: "1rem" }}>
            <Link to="/products" style={{ color: "#007bff" }}>
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>

      {/* 🔥 RECOMMENDATIONS SECTION */}
      <div style={{ marginTop: "3rem" }}>
        <h3>Recommended Products</h3>

        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          {recommendations.length === 0 ? (
            <p>No recommendations available</p>
          ) : (
            recommendations.map(item => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  borderRadius: "8px",
                  width: "150px",
                  textAlign: "center"
                }}
              >
                <h4 style={{ fontSize: "14px" }}>{item.name}</h4>
                <p style={{ color: "#007bff" }}>₹{item.price}</p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

export default ProductDetails;