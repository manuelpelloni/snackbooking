const express = require("express");
const router = express.Router();
const db = require("../../database");
const sql = require("mssql");
const moment = require("moment-timezone");

router.post("/add", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  const { product_id } = req.body;

  try {
    const result = await db
      .createQuery()
      .input("product_id", sql.Int, product_id)
      .input("user_id", sql.Int, user.user_id)
      .query(
        `IF EXISTS (SELECT id 
                    FROM users 
                    WHERE submitted_at IS NULL 
                      AND id = @user_id)
          IF EXISTS (SELECT id
                        FROM users_products
                        WHERE user_id = @user_id
                          AND product_id = @product_id
                          AND quantity > 0)
              BEGIN
                  UPDATE users_products
                    SET users_products.quantity += 1,
                        add_at = Getdate()
                    FROM users_products
                      INNER JOIN users ON users_products.user_id = users.id
                    WHERE users_products.user_id = @user_id
                      AND users_products.product_id = @product_id
              END
            ELSE
              INSERT INTO users_products (product_id, user_id, quantity)
                VALUES (@product_id, @user_id, 1)`
      );

    if (!result.rowsAffected[0]) throw Error;

    res.json({
      message: "Aggiunto al carrello",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Non aggiunto al carrello",
      success: false,
    });
  }
});

router.post("/delete", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  const { product_id } = req.body;

  try {
    const result = await db
      .createQuery()
      .input("product_id", sql.Int, product_id)
      .input("user_id", sql.Int, user.user_id)
      .query(
        `DELETE users_products
         FROM users_products 
          INNER JOIN users on users_products.user_id = users.id
         WHERE users_products.user_id = @user_id 
          AND users_products.product_id = @product_id
          AND users.submitted_at IS NULL`
      );

    if (!result.rowsAffected[0]) throw Error;

    res.json({
      message: "Eliminato dal carrello",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Non eliminato dal carrello",
      success: false,
    });
  }
});

router.post("/remove", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  const { product_id } = req.body;

  try {
    const result = await db
      .createQuery()
      .input("product_id", sql.Int, product_id)
      .input("user_id", sql.Int, user.user_id)
      .query(
        `UPDATE users_products
           SET users_products.quantity = quantity-1,
               add_at = Getdate()
           FROM users_products
            INNER JOIN users ON users_products.user_id = users.id
           WHERE users_products.user_id = @user_id
            AND users_products.product_id = @product_id
            AND users_products.quantity >= 2
            AND users.submitted_at IS NULL`
      );

    if (!result.rowsAffected[0]) throw Error;

    res.json({
      message: "Tolto 1 pezzo dal carrello",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Impossibile togliere 1 pezzo dal carrello",
      success: false,
    });
  }
});

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
