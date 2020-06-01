const express = require("express");
const router = express.Router();
const db = require("../../database");
const sql = require("mssql");

router.get("/info", async (req, res) => {
  const user = await db.userFromRequest(req);
  if (!user) return res.status(401).json({ message: "Devi prima loggarti" });
  res.json(user);
});

router.get("/orders", async (req, res) => {
  const user = await db.userFromRequest(req);
  if (!user) return res.status(401).json({ message: "Devi prima loggarti" });

  const { user_id } = user;

  const result = await db
    .createQuery()
    .input("id", sql.Int, user_id)
    .query(
      "SELECT users.id AS user_id, CONCAT(users.class_number, UPPER(users.section)) AS user_class,\
        users.submitted_at as submitted_at, users_products.quantity AS product_quantity,\
        products.id AS product_id, products.name AS product_name,\
        products.description AS product_description, products.price AS product_price\
      FROM users\
      LEFT OUTER JOIN	users_products on users_products.user_id = users.id \
      INNER JOIN products on products.id = users_products.product_id\
      WHERE users.id = @id\
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
