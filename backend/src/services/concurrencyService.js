const pool = require("../config/db");

// ------------------
// PESSIMISTIC LOCKING
// ------------------
async function placeOrderPessimistic(productId, quantity, userId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const product = await client.query(
      "SELECT * FROM products WHERE id=$1 FOR UPDATE",
      [productId]
    );

    if (product.rows.length === 0)
      throw new Error("Product not found");

    const stock = product.rows[0].stock;

    if (stock < quantity) {
      await client.query(
        "INSERT INTO orders(product_id,quantity_ordered,user_id,status) VALUES($1,$2,$3,'FAILED_OUT_OF_STOCK')",
        [productId, quantity, userId]
      );
      await client.query("ROLLBACK");
      return { error: "Insufficient stock" };
    }

    await client.query(
      "UPDATE products SET stock = stock - $1 WHERE id=$2",
      [quantity, productId]
    );

    await client.query(
      "INSERT INTO orders(product_id,quantity_ordered,user_id,status) VALUES($1,$2,$3,'SUCCESS')",
      [productId, quantity, userId]
    );

    await client.query("COMMIT");
    return { message: "Order placed (Pessimistic)" };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}


// ------------------
// OPTIMISTIC LOCKING
// ------------------
async function placeOrderOptimistic(productId, quantity, userId) {
  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const productRes = await client.query(
        "SELECT stock, version FROM products WHERE id=$1",
        [productId]
      );

      const { stock, version } = productRes.rows[0];

      if (stock < quantity) {
        await client.query("ROLLBACK");
        return { error: "Insufficient stock" };
      }

      const updateRes = await client.query(
        `UPDATE products
         SET stock = stock - $1,
             version = version + 1
         WHERE id=$2 AND version=$3`,
        [quantity, productId, version]
      );

      if (updateRes.rowCount === 1) {
        await client.query(
          "INSERT INTO orders(product_id,quantity_ordered,user_id,status) VALUES($1,$2,$3,'SUCCESS')",
          [productId, quantity, userId]
        );

        await client.query("COMMIT");
        return { message: "Order placed (Optimistic)" };
      }

      await client.query("ROLLBACK");
      await new Promise(r => setTimeout(r, 50 * Math.pow(2, attempt)));

    } finally {
      client.release();
    }
  }

  return { error: "Conflict after retries", status: 409 };
}

module.exports = { placeOrderPessimistic, placeOrderOptimistic };