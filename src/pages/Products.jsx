import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

function Products() {
  const [products, setProducts] = useState([]);
  const { dispatch } = useCart();

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ textAlign: "center" }}>🛍️ Products</h2>
      <p style={{ textAlign: "center" }}>
        Browse our list of available products below.
      </p>

      {/* ✅ GRID LAYOUT */}
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>

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
