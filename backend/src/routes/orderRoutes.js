const express = require("express");
const router = express.Router();
const {
  placeOrderPessimistic,
  placeOrderOptimistic,
} = require("../services/concurrencyService");

router.post("/pessimistic", async (req, res) => {
  const result = await placeOrderPessimistic(
    req.body.productId,
    req.body.quantity,
    req.body.userId
  );
  res.json(result);
});

router.post("/optimistic", async (req, res) => {
  const result = await placeOrderOptimistic(
    req.body.productId,
    req.body.quantity,
    req.body.userId
  );
  res.json(result);
});

module.exports = router;