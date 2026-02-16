const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";

    let products = [];

    // 🔹 1. Try FakeStore first
    const fakeRes = await axios.get("https://fakestoreapi.com/products");

    let filtered = fakeRes.data.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    );

    if (!search) {
      products = fakeRes.data.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        description: item.description,
        category: item.category,
        image: item.image,
      }));
    }

    // 🔥 2. If no results → use DummyJSON
    if (filtered.length === 0 && search) {
      const dummyRes = await axios.get(
        `https://dummyjson.com/products/search?q=${search}`
      );

      // normalize data (IMPORTANT)
      products = dummyRes.data.products.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        description: item.description,
        category: item.category,
        image: item.thumbnail,
      }));
    } else {
      products = filtered;
    }

    res.json(products);

  } catch (err) {
    console.error("🔥 ERROR:", err.message);
    res.json({ message: "Server Error" });
  }
});

module.exports = router;
