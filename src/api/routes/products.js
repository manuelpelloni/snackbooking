const express = require("express");
const router = express.Router();
const db = require("../../database");
const sql = require("mssql");

//users request the list of avaiable products
router.get("/", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  const result = await db
    .createQuery()
    .query("SELECT id, name, description, price FROM products ORDER BY name");

  res.json(result.recordset);
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
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

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
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

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
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

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
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  const { product_id } = req.body;
  const { user_id } = user;

  const result = await db
    .createQuery()
    .input("product_id", sql.Int, product_id)
    .input("user_id", sql.Int, user_id)
    .query(
      "SELECT users_products.quantity as product_quantity\
       FROM users_products\
       WHERE users_products.user_id = @user_id\
        and users_products.product_id = @product_id"
    );

  const product_quantity = result.recordset[0]
    ? result.recordset[0].product_quantity
    : 0;

  try {
    if (product_quantity) {
      await db
        .createQuery()
        .input("product_id", sql.Int, product_id)
        .input("user_id", sql.Int, user_id)
        .input("product_quantity", sql.Int, product_quantity + 1)
        .query(
          "UPDATE users_products\
           SET quantity = @product_quantity, add_at = GETDATE()\
           WHERE users_products.user_id = @user_id and product_id = @product_id"
        );
    } else {
      await db
        .createQuery()
        .input("product_id", sql.Int, product_id)
        .input("user_id", sql.Int, user_id)
        .input("product_quantity", sql.Int, product_quantity + 1)
        .query(
          "INSERT INTO users_products(product_id, user_id, quantity)\
           VALUES (@product_id, @user_id, @product_quantity)"
        );
    }

    res.json({
      message: "Aggiunto al carrello",
      success: true,
    });
  } catch (err) {
    res.json({
      err: err.message,
      message: "Non aggiunto al carrello",
      success: false,
    });
  }
});

router.post("/delete-from-cart", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  const { product_id } = req.body;
  const { user_id } = user;

  try {
    await db
      .createQuery()
      .input("product_id", sql.Int, product_id)
      .input("user_id", sql.Int, user_id)
      .query(
        "DELETE FROM users_products\
         WHERE users_products.user_id = @user_id and users_products.product_id = @product_id"
      );
    res.json({
      message: "Eliminato dal carrello",
      success: true,
    });
  } catch (err) {
    res.json({
      err: err.message,
      message: "Non eliminato dal carrello",
      success: false,
    });
  }
});

router.post("/remove-one-from-cart", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  const { product_id } = req.body;
  const { user_id } = user;
  const result = await db
    .createQuery()
    .input("product_id", sql.Int, product_id)
    .input("user_id", sql.Int, user_id)
    .query(
      "SELECT users_products.quantity as product_quantity\
       FROM users_products\
       WHERE users_products.user_id = @user_id\
        and users_products.product_id = @product_id"
    );

  const product_quantity = result.recordset[0]
    ? result.recordset[0].product_quantity
    : 0;

  try {
    if (product_quantity >= 2) {
      await db
        .createQuery()
        .input("product_id", sql.Int, product_id)
        .input("user_id", sql.Int, user_id)
        .input("product_quantity", sql.Int, product_quantity - 1)
        .query(
          "UPDATE users_products\
           SET quantity = @product_quantity, add_at = GETDATE()\
           WHERE users_products.user_id = @user_id and product_id = @product_id"
        );
      res.json({
        message: "Tolto 1 pezzo dal carrello",
        success: true,
      });
    } else {
      res.json({
        message:
          "Hai solo 1 pezzo dal carrello, impossinile toglierlo, devi eliminare il prodotto",
        success: false,
      });
    }
  } catch (err) {
    res.json({
      message: "Impossibile togliere 1 pezzo dal carrello",
      success: false,
    });
  }
});

module.exports = router;
