const express = require("express");
const pool = require("../config/db");
const router = express.Router();

router.get("/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM products WHERE id=$1", [
    req.params.id,
  ]);
  res.json(result.rows[0]);
});

router.post("/reset", async (req, res) => {
  await pool.query("UPDATE products SET stock=100, version=1 WHERE id=1");
  res.json({ message: "Reset successful" });
});

router.get("/stats/all", async (req, res) => {
  const stats = await pool.query(
    "SELECT status, COUNT(*) FROM orders GROUP BY status"
  );
  res.json(stats.rows);
});

module.exports = router;