const express = require("express");
const router = express.Router();
const db = require("../../database");

router.get("/", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;
  if (!user.admin)
    return res.status(403).json({ message: "Non sei un amministratore" });

  try {
    const result = await db.Users.findAll({
      include: [
        {
          model: db.Products,
        },
      ],

      attributes: [
        /*
        [db.sequelize.literal('"user_product"."product"."id"'), "id"],
        [db.sequelize.literal('"users_products"."product"."price"'), "price"],*/
        //  [db.sequelize.literal('"users_products"."quantity"'), "quantity"],
        //  [db.sequelize.literal('"users_products"."price"'), "price"],
        [db.sequelize.literal('"class_number" || "section"'), "class"],
      ],
      where: {
        submitted_at: {
          [db.Op.ne]: null,
        },
      },
    });
    /*
    const result = await db
      .createQuery()
      .query(
        "SELECT CONCAT(users.class_number, UPPER(users.section)) as class, products.name, products.price, users_products.quantity\
        FROM users JOIN users_products JOIN products\
         ON products.id = users_products.product_id\
         ON users_products.user_id = users.id\
        WHERE users.submitted_at IS NOT NULL"
      );
*/
    const parsed_result = result.map((obj) => obj.toJSON());
    const orders = {};
    for (const item of parsed_result) {
      console.log(item.products.users_products);
      const order = orders[item.class] || {
        class: item.class,
        items: [],
      };

      order.items.push({
        name: item.products[0].name,
        price: item.products[0].price,
        quantity: item.products[0].users_products.quantity,
      });

      orders[item.class] = order;
    }

    res.json(Object.values(orders));
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Errore nell'ottenere la lista degli ordini",
    });
  }
});

module.exports = router;
