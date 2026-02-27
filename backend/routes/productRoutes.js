const express = require("express");
const router = express.Router();
const axios = require("axios");


// ================= 🔹 GET ALL PRODUCTS (WITH SEARCH) =================
router.get("/", async (req, res) => {
  const search = req.query.search || "";
  const keyword = search.toLowerCase().trim();

  let products = [];

  // 🔹 FakeStore
  try {
    const fakeRes = await axios.get(
      "https://fakestoreapi.com/products",
      { timeout: 7000 }
    );

    if (!keyword) {
      products = fakeRes.data;
    } else {
      const regex = new RegExp(keyword, "i");
      products = fakeRes.data.filter((p) => regex.test(p.title));
    }

    console.log("✅ FakeStore success");

  } catch (err) {
    console.log("❌ FakeStore failed:", err.message);
  }

  // 🔹 DummyJSON fallback
  if (products.length === 0) {
    try {
      const dummyRes = await axios.get(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(keyword)}`,
        { timeout: 7000 }
      );

      products = dummyRes.data.products.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        description: item.description,
        category: item.category,
        image: item.thumbnail,
      }));

      console.log("✅ DummyJSON success");

    } catch (err) {
      console.log("❌ DummyJSON failed:", err.message);
    }
  }

  res.json(products || []);
});


// ================= 🔹 GET SINGLE PRODUCT BY ID =================
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 🔹 Try FakeStore (direct single product)
    const response = await axios.get(
      `https://fakestoreapi.com/products/${id}`
    );

    console.log("✅ Single product from FakeStore");
    return res.json(response.data);

  } catch (err) {
    console.log("❌ FakeStore single failed:", err.message);

    try {
      // 🔹 Fallback to DummyJSON
      const response = await axios.get(
        `https://dummyjson.com/products/${id}`
      );

      const item = response.data;

      console.log("✅ Single product from DummyJSON");

      return res.json({
        id: item.id,
        title: item.title,
        price: item.price,
        description: item.description,
        category: item.category,
        image: item.thumbnail,
      });

    } catch (err2) {
      console.log("❌ DummyJSON single failed:", err2.message);
      return res.status(404).json({ message: "Product not found" });
    }
  }
});

module.exports = router;