import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { useSwipeable } from "react-swipeable";
import { useAuth } from "../context/AuthContext";

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imagesReady, setImagesReady] = useState(false);

  const { dispatch } = useCart();
  const intervalRef = useRef(null);

  const SLIDE_DURATION = 2000; // ms
  const TICK = 50; // progress update interval

  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1510552776732-03e61cf4b144?auto=format&fit=crop&w=1200&q=80",
      title: "Latest Electronics",
      subtitle: "Discover the newest gadgets and devices at the best prices.",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
      title: "Fashion Collection",
      subtitle: "Style that fits you — shop our trending fashion picks.",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      title: "Home & Living",
      subtitle: "Transform your space with beautiful home essentials.",
    },
  ];

  /* ================= IMAGE PRELOAD (ORDERED) ================= */
  useEffect(() => {
    const preloadImages = async () => {
      for (let i = 0; i < slides.length; i++) {
        await new Promise((resolve) => {
          const img = new Image();
          img.src = slides[i].image;
          img.onload = resolve;
          img.onerror = resolve; // fail-safe
        });
      }
      setImagesReady(true);
    };

    preloadImages();
  }, []);

  /* ================= AUTOPLAY + PROGRESS ================= */
  useEffect(() => {
    if (!imagesReady || isHovered) return;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((s) => (s + 1) % slides.length);
          return 0;
        }
        return prev + 100 / (SLIDE_DURATION / TICK);
      });
    }, TICK);

    return () => clearInterval(intervalRef.current);
  }, [isHovered, imagesReady, slides.length]);

  /* Reset progress on manual slide change */
  useEffect(() => {
    setProgress(0);
  }, [currentSlide]);

  /* ================= DATA ================= */
  useEffect(() => {
    fetch("https://fakestoreapi.com/products?limit=4")
      .then((res) => res.json())
      .then((data) => setFeaturedProducts(data));
  }, []);

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentSlide((p) => (p + 1) % slides.length),
    onSwipedRight: () =>
      setCurrentSlide((p) => (p - 1 + slides.length) % slides.length),
    trackMouse: true,
  });
  
  return (
    <div style={{ padding: "1rem", fontFamily: "Arial" }}>
      
      {/* ================= CAROUSEL ================= */}
      {imagesReady && (
        <section
          {...swipeHandlers}
          className="carousel"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "1200px",
            height: "400px",
            margin: "0 auto 3rem",
            overflow: "hidden",
            borderRadius: "14px",
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              style={{
                position: "absolute",
                inset: 0,
                opacity: index === currentSlide ? 1 : 0,
                transition: "opacity 0.8s ease-in-out",
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
                  top: "32%",
                  left: "8%",
                  color: "white",
                  maxWidth: "85%",
                }}
              >
                <h2 style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>
                  {slide.title}
                </h2>
                <p style={{ fontSize: "1rem", marginBottom: "0.8rem" }}>
                  {slide.subtitle}
                </p>

                <Link to="/products">
                  <button
                    style={{
                      background: "#2874f0",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Shop Now →
                  </button>
                </Link>
              </div>
            </div>
          ))}

          {/* ================= DOT PROGRESS ================= */}
          <div
            style={{
              position: "absolute",
              bottom: "14px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "10px",
            }}
          >
            {slides.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentSlide(i)}
                style={{
                  width: "28px",
                  height: "6px",
                  background: "rgba(255,255,255,0.4)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                {i === currentSlide && (
                  <div
                    style={{
                      height: "100%",
                      width: `${progress}%`,
                      background: "#fff",
                      transition: "width 0.05s linear",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= FEATURED PRODUCTS ================= */}
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
          <div className="featured-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
            />
          ))}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link to="/products">
            <button
              style={{
                background: "#28a745",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              View All Products →
            </button>
          </Link>
        </div>
      </section>

      {/* ================= MOBILE ONLY ================= */}
      <style>
        {`
          .featured-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            flex-wrap: wrap;
            justify-items: center;
            gap: 32px;
            max-width: 1200px;
            margin: 0 auto;
          }
          @media (max-width: 768px) {
            .featured-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 14px;              /* space between cards */
              padding: 0 12px;        /* LEFT + RIGHT space */
              box-sizing: border-box;
            }
            .carousel {
              height: 260px;
            }
            .carousel h2 {
              font-size: 1rem;
            }
            .carousel p {
              font-size: 0.7rem;
            }
            .carousel button {
              font-size: 0.75rem;
              padding: 6px 12px;
            }
            .featured-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 1px;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Home;
