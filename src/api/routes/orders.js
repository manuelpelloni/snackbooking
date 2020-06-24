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

module.exports = router;
