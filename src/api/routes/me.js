const express = require("express");
const router = express.Router();
const db = require("../../database");
const sql = require("mssql");

router.get("/orders/:user_id", async (req, res) => {
  const user = await db.userFromRequest(req);
  if (!user) return res.status(401).json({ message: "Devi prima loggarti" });

  const id = req.query.user_id;

  const result = await db
    .createQuery()
    .input("id", sql.Int, id)
    .query(
      "SELECT CONCAT(users.class_number, users.section) AS class,\
                    orders.id, orders.submit, products.name AS product_name,\
                    products.description AS product_description, products.price AS product_price,\
                    orders_products.quantity, orders_products.product_id, orders.created_at\
                FROM orders\
                LEFT OUTER JOIN orders_products ON orders_products.order_id = orders.id\
                INNER JOIN products ON products.id = orders_products.product_id\
                INNER JOIN users ON users.id = orders.user_id\
                WHERE orders.user_id = @id"
    );
  const orders = [];
  for (const item of result.recordset) {
    const order = orders[item.id] || {
      id: item.id,
      class: item.class,
      description: item.description,
      items: [],
    };
    order.items.push({
      product: {
        id: item.product_id,
        name: item.product_name,
        description: item.product_description,
        price: item.product_price,
      },
      quantity: item.quantity,
    });
    orders[item.id] = order;
  }
  res.json(orders.flat(1));
});

module.exports = router;
