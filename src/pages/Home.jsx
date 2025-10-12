import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { useSwipeable } from "react-swipeable";

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { dispatch } = useCart();

  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1510552776732-03e61cf4b144?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Latest Electronics",
      subtitle: "Discover the newest gadgets and devices at the best prices.",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Fashion Collection",
      subtitle: "Style that fits you — shop our trending fashion picks.",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      title: "Home & Living",
      subtitle: "Transform your space with beautiful home essentials.",
    },
  ];

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Fetch featured products
  useEffect(() => {
    fetch("https://fakestoreapi.com/products?limit=4")
      .then((res) => res.json())
      .then((data) => setFeaturedProducts(data))
      .catch((err) => console.error(err));
  }, []);

  // Add to Cart
  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    toast.success(`🛒 Added "${product.title}" to cart!`);
  };

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setCurrentSlide((prev) => (prev + 1) % slides.length),
    onSwipedRight: () =>
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true, // allows desktop drag as well
  });

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      {/* Carousel Section */}
      <section
        {...swipeHandlers}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1200px",
          height: "400px",
          overflow: "hidden",
          borderRadius: "15px",
          margin: "0 auto 3rem",
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            style={{
              position: "absolute",
              top: 0,
              left: `${(index - currentSlide) * 100}%`,
              width: "100%",
              height: "100%",
              transition: "left 0.8s ease",
            }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.75)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "40%",
                left: "10%",
                color: "white",
                textShadow: "2px 2px 6px rgba(0,0,0,0.6)",
                maxWidth: "50%",
              }}
            >
              <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                {slide.title}
              </h2>
              <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                {slide.subtitle}
              </p>
              <Link to="/products">
                <button
                  style={{
                    padding: "10px 20px",
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Shop Now →
                </button>
              </Link>
            </div>
          </div>
        ))}

        {/* Manual Navigation Buttons */}
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
          }
          style={{
            position: "absolute",
            top: "50%",
            left: "10px",
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.4)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
          }}
        >
          ◀
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.4)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
          }}
        >
          ▶
        </button>
      </section>

      {/* Featured Products */}
      <section>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          🌟 Featured Products
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))
          ) : (
            <p>Loading products...</p>
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link to="/products">
            <button
              style={{
                background: "#28a745",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              View All Products →
            </button>
          </Link>
        </div>
      </section>

      {/* Responsive Styles */}
      <style>
        {`
          @media (max-width: 768px) {
            section {
              height: 250px !important;
            }
            h2 {
              font-size: 1.3rem !important;
            }
            p {
              font-size: 0.9rem !important;
            }
            button {
              font-size: 0.8rem !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Home;
