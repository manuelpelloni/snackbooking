const express = require("express");
const router = express.Router();
const db = require("../../database");
const sql = require("mssql");
const moment = require("moment-timezone");

router.get("/", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;
  if (!user.admin)
    return res.status(403).json({ message: "Non sei un amministratore" });

  try {
    const result = await db
      .createQuery()
      .query(
        "SELECT CONCAT(users.class_number, UPPER(users.section)) as class, products.name, products.price, users_products.quantity\
        FROM users JOIN users_products JOIN products\
         ON products.id = users_products.product_id\
         ON users_products.user_id = users.id\
        WHERE users.submitted_at IS NOT NULL"
      );

    const orders = {};
    for (const item of result.recordset) {
      const order = orders[item.class] || {
        class: item.class,
        items: [],
      };

      order.items.push({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      });

      orders[item.class] = order;
    }

    res.json(Object.values(orders));
  } catch (err) {
    res.status(500).json({
      message: "Errore nell'ottenere la lista degli ordini",
    });
  }
});

module.exports = router;
