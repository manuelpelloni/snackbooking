const express = require("express");
const router = express.Router();
const db = require("../../database");
const sql = require("mssql");

router.get("/info", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  const order_time_limit = process.env.ORDER_TIME_LIMIT.split(":");

  res.json({
    user: user,
    hours: order_time_limit[0],
    minutes: order_time_limit[1],
  });
});

router.get("/orders", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  const { user_id, submitted_at } = user;

  const result = await db
    .createQuery()
    .input("user_id", sql.Int, user_id)
    .query(
      "SELECT users_products.quantity AS product_quantity,\
              products.id AS product_id, products.name AS product_name,\
            products.description AS product_description, products.price AS product_price\
      FROM users_products \
      INNER JOIN products on products.id = users_products.product_id\
      WHERE users_products.user_id = @user_id\
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

router.post("/order-time-limit", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  if (!user.admin)
    return res.status(403).json({ message: "Non sei un amministratore" });

  const { hours, minutes } = req.body;
  if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 60) {
    process.env.ORDER_TIME_LIMIT = `${hours}:${minutes}`;

    return res.json({
      message: "Orario limite aggiornato correttamente",
      success: true,
    });
  }

  res.json({
    message: "Orario limite non aggiornato",
    success: false,
  });
});

module.exports = router;
