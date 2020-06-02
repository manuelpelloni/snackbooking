const express = require("express");
const router = express.Router();
const db = require("../../database");
const sql = require("mssql");

router.get("/info", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if(!user) return;

  res.json(user);
});

router.get("/orders", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if(!user) return;

  const { user_id } = user;

  const result = await db
    .createQuery()
    .input("id", sql.Int, user_id)
    .query(
      "SELECT users_products.quantity AS product_quantity,\
              products.id AS product_id, products.name AS product_name,\
            products.description AS product_description, products.price AS product_price\
  FROM users_products \
    INNER JOIN products on products.id = users_products.product_id\
  WHERE users_products.user_id = 5\
  ORDER BY users_products.add_at DESC"
    );

  const cart = {
    ...user,
    items: [],
  };
  for (const item of result.recordset) {
    cart.items.push({
      product: {
        id: item.product_id,
        name: item.product_name,
        description: item.product_description,
        price: item.product_price,
      },
      quantity: item.product_quantity,
    });
  }
  res.json(cart);
});

module.exports = router;
