const express = require("express");
const router = express.Router();
const db = require("../../database");
const sql = require("mssql");

//users request the list of avaiable products
router.get("/", async (req, res) => {
  const user = await db.userFromRequest(req);
  if (!user) return res.status(401).json({ message: "Devi prima loggarti" });

  const result = await db
    .createQuery()
    .query(
      "SELECT id, name, description, price FROM products WHERE deleted_at IS NULL ORDER BY name"
    );
  return res.json(result.recordset);
});

/*
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const result = await db
    .createQuery()
    .input("id", sql.Int, id)
    .query("SELECT id, name, description, price FROM products WHERE id = @id");
  res.json(result.recordset);
});*/

//admin add new product
router.post("/", async (req, res) => {
  const user = await db.userFromRequest(req);
  if (!user) return res.status(401).json({ message: "Devi prima loggarti" });
  if (!user.admin)
    return res.status(403).json({ message: "Non sei un amministratore" });

  const { price, name, description } = req.body;
  const result = await db
    .createQuery()
    .input("name", sql.VarChar, name)
    .input("description", sql.VarChar, description)
    .input("price", sql.Money, price)
    .query(
      "INSERT INTO products(name, description, price) VALUES (@name, @description, @price)"
    );

  res.send();
});

router.patch("/:id", async (req, res) => {
  const user = await db.userFromRequest(req);
  if (!user) return res.status(401).json({ message: "Devi prima loggarti" });
  if (!user.admin)
    return res.status(403).json({ message: "Non sei un amministratore" });

  const { id } = req.params;
  const { price, name, description } = req.body;
  const result = await db
    .createQuery()
    .input("id", sql.Int, id)
    .input("name", sql.VarChar, name)
    .input("description", sql.VarChar, description)
    .input("price", sql.Money, price)
    .query(
      "UPDATE products SET name = @name, description = @description, price = @price WHERE id = @id"
    );

  res.send();
});

router.delete("/:id", async (req, res) => {
  const user = await db.userFromRequest(req);
  if (!user) return res.status(401).json({ message: "Devi prima loggarti" });
  if (!user.admin)
    return res.status(403).json({ message: "Non sei un amministratore" });

  const { id } = req.params;
  const result = await db
    .createQuery()
    .input("id", sql.Int, id)
    .query("UPDATE products SET deleted_at = GETDATE() WHERE id = @id");

  res.send();
});

router.post("/add-to-cart", async (req, res) => {
  const user = await db.userFromRequest(req);
  if (!user) return res.status(401).json({ message: "Devi prima loggarti" });
  const { product_id } = req.body;
  console.log(product_id);

  const result = await db
    .createQuery()
    .input("product_id", sql.Int, product_id)
    .input("user_id", sql.Int, user.id)
    .query(
      "SELECT orders_products.quantity as product_quantity, orders.id as order_id\
            FROM orders_products\
                join orders on orders.id = orders_products.order_id\
            WHERE orders.user_id = @user_id and orders_products.product_id = @product_id"
    );

  try {
    const { product_quantity, order_id } = result.recordset[0];
    console.log(product_quantity, order_id);
    if (product_quantity) {
      await db
        .createQuery()
        .input("product_id", sql.Int, product_id)
        .input("order_id", sql.Int, order_id)
        .input("product_quantity", sql.Int, product_quantity + 1)
        .query(`UPDATE orders_products\
        SET quantity =  @product_quantity\
        WHERE order_id = @order_id and product_id = @product_id`);
    }

    res.json({
      message: "Aggiunto al carrello",
      added: true,
    });
  } catch (err) {
    res.json({
      err: err.message,
      message: "Non ggiunto al carrello",
      added: false,
    });
  }
});

module.exports = router;
