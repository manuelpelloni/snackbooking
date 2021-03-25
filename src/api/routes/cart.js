const express = require("express");
const router = express.Router();
const db = require("../../database");
const moment = require("moment-timezone");

router.post("/add", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  const { product_id } = req.body;
  const { user_id } = user;

  try {
    const product = await db.UsersProducts.findOne({
      where: {
        user_id,
        product_id,
      },
      raw: true,
      attributes: ["quantity"],
    });

    if (product === null)
      db.UsersProducts.create({
        user_id,
        product_id,
      }).then(() =>
        res.json({
          message: "Inserito nel carrello",
          success: true,
        })
      );
    else
      db.UsersProducts.update(
        {
          quantity: product.quantity + 1,
          add_at: moment.utc(new Date()),
        },
        { where: { user_id, product_id } }
      ).then((a) => {
        res.json({
          message: "Aggiunto al carrello",
          success: true,
        });
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
  const { user_id } = user;

  try {
    const deleted = await db.UsersProducts.destroy({
      where: {
        user_id,
        product_id,
      },
    });

    if (deleted < 1) throw Error;

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
  const { user_id } = user;

  try {
    const removed = await db.UsersProducts.decrement(
      {
        quantity: 1,
      },
      { where: { user_id, product_id } }
    );

    //contains the number of rows affected
    if (removed[0][1] != 1) throw Error;

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

  const { user_id } = user;

  const now = moment().utc(new Date());
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
    await db.Users.update(
      { submitted_at: moment().utc(new Date()) },
      { where: { id: user_id } }
    );

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

  const { user_id } = user;

  const now = moment().utc(new Date());
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
    await db.Users.update({ submitted_at: null }, { where: { id: user_id } });
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
