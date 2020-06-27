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

  res.json({
    products: result.recordset,
    admin: user.admin,
  });
});

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

  if (!result.rowsAffected)
    return res
      .status(404)
      .json({ message: "Impossibile inserire il prodotto", success: false });

  res.json({ message: "Prodotto inserito" });
});

//read one product info
router.get("/:id", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  if (!user.admin)
    return res.status(403).json({ message: "Non sei un amministratore" });

  const { id } = req.params;

  const result = await db.createQuery().input("id", sql.Int, id).query(
    `SELECT price, name, description 
       FROM products 
       WHERE id = @id`
  );

  result.recordset[0]
    ? res.json({
        ...result.recordset[0],
      })
    : res.json({
        message: "I dati del panino da modificare non sono stati trovati",
        success: false,
      });
});

//update a product
router.post("/:id", async (req, res) => {
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

  if (!result.rowsAffected)
    return res
      .status(404)
      .json({ message: "Il prodotto non esiste", success: false });

  res.json({ message: "Prodotto modificato" });

  res.send();
});

//delete a product
router.delete("/:id", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  if (!user.admin)
    return res.status(403).json({ message: "Non sei un amministratore" });

  const { id } = req.params;

  const result = await db
    .createQuery()
    .input("id", sql.Int, id)
    .query("DELETE FROM products WHERE id = @id");

  if (!result.rowsAffected)
    return res
      .status(404)
      .json({ message: "Il prodotto non esiste", success: false });

  res.json({ message: "Prodotto eliminato" });
});

module.exports = router;
