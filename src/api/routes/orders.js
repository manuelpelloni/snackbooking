const express = require("express");
const router = express.Router();
const db = require("../../database");
const sql = require("mssql");
const moment = require("moment-timezone");

router.post("/submit", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  const now = moment().tz("Europe/Rome");
  const order_time_limit = process.env.ORDER_TIME_LIMIT.split(":");

  if (
    !(now.hours() == order_time_limit[0]
      ? now.minutes() < order_time_limit[1]
      : now.hours() < order_time_limit[0])
  )
    return res.status(403).json({
      message: `Non puoi ordinare dopo le ${process.env.ORDER_TIME_LIMIT}`,
    });

  try {
    await db.createQuery().input("user_id", sql.Int, user.user_id)
      .query(`UPDATE users 
              SET submitted_at = GETDATE()
              WHERE id = @user_id`);

    res.json({
      message: "Ordine effettuato!",
    });
  } catch (err) {
    res.status(500).json({
      message: "Non è possibile effettuare l'ordine",
    });
  }
});

router.post("/cancel", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  const now = moment().tz("Europe/Rome");
  const order_time_limit = process.env.ORDER_TIME_LIMIT.split(":");

  if (
    !(now.hours() == order_time_limit[0]
      ? now.minutes() < order_time_limit[1]
      : now.hours() < order_time_limit[0])
  )
    return res.status(403).json({
      message: `Non puoi ordinare dopo le ${process.env.ORDER_TIME_LIMIT}`,
    });

  try {
    await db.createQuery().input("user_id", sql.Int, user.user_id)
      .query(`UPDATE users 
            SET submitted_at = NULL
            WHERE id = @user_id`);

    res.json({
      message: "Ordine annullato",
    });
  } catch (err) {
    res.status(500).json({
      message: "Non è possibile annullare l'ordine",
    });
  }
});

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
