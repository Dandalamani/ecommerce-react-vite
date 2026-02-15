import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useCart();
  const location = useLocation();
  const API = import.meta.env.VITE_API_URL;
  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

  useEffect(() => { setLoading(true);
    axios.get(`${API}/api/products?search=${searchQuery}`)
    .then(res => {
      console.log("DATA:", res.data); // 👈 check here
      setProducts(res.data || []);
    })
    .catch((err) => {
        console.error("ERROR:", err);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchQuery, API]); // ✅ correct dependency

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ textAlign: "center" }}>🛍️ Products</h2>
      {searchQuery && (
        <p style={{ textAlign: "center", marginBottom: "10px" }}>
          Showing results for "<strong>{searchQuery}</strong>"
        </p>
      )}
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading products...</p>
      ) : (

      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>
            ❌ No products found
          </p>
        )}
      </div>
      )}

      {/* ✅ RESPONSIVE GRID CSS */}
      <style>
        {`
          .product-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr)); /* desktop */
            gap: 23px;
            margin-top: 0rem;
            padding: 0 50px; /* equal left & right space */
            justify-items: center; 
            align-content: start;
          }

          @media (max-width: 768px) {
            .product-grid {
              grid-template-columns: repeat(2, 1fr); /* mobile: 2 per row */
              gap: 0px;
              padding: 0 0px; /* equal left & right space */
            }
          }
        `}
      </style>
    </div>
  );
}

export default Products;
