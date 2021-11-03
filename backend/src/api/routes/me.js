const express = require("express");
const router = express.Router();
const db = require("../../database");

router.get("/info", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  const order_time_limit = process.env.ORDER_TIME_LIMIT.split(":");

  res.json({
    user,
    hours: order_time_limit[0],
    minutes: order_time_limit[1],
  });
});

router.get("/orders", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return res.status(502);

  const { user_id } = user;
  const cart = {
    ...user,
    items: [],
  };

  try {
    const result = await db.UsersProducts.findAll({
      include: [{ model: db.Products, as: "product", attributes: [] }],
      where: {
        user_id,
      },
      raw: true,
      attributes: [
        "quantity",
        [db.sequelize.literal('"product"."id"'), "product_id"],
        [db.sequelize.literal('"product"."name"'), "product_name"],
        [
          db.sequelize.literal('"product"."description"'),
          "product_description",
        ],
        [db.sequelize.literal('"product"."price"'), "product_price"],
      ],
      order: [["add_at", "DESC"]],
    });

    if (result.length > 0) {
      for (const item of result) {
        cart.items.push({
          product: {
            id: item.product_id,
            name: item.product_name,
            description: item.product_description,
            price: item.product_price,
          },
          quantity: item.quantity,
        });
      }
      res.json(cart);
    } else delete cart.items;
  } catch (err) {
    console.log(err);
    res.status(500).json();
  }
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
