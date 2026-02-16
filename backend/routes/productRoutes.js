const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  const search = req.query.search || "";

  let products = [];

  // 🔹 FakeStore
  try {
    const fakeRes = await axios.get(
      "https://fakestoreapi.com/products",
      { timeout: 7000 }
    );

    products = fakeRes.data.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );

    console.log("✅ FakeStore success");

  } catch (err) {
    console.log("❌ FakeStore failed:", err.message);
  }

  // 🔹 DummyJSON fallback
  if (products.length === 0) {
    try {
      const dummyRes = await axios.get(
        `https://dummyjson.com/products/search?q=${search}`,
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

  // 🔥 ALWAYS RETURN ARRAY (NO ERROR)
  res.json(products || []);
});

module.exports = router;
