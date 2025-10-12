import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
function Products() {
  const [products, setProducts] = useState([]);
  const { dispatch } = useCart();
  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    alert(`${product.title} added to cart!`);
  };
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center" }}>🛍️ Products Page</h2>
      <p style={{ textAlign: "center" }}>
        Browse our list of available products below.
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}
export default Products;