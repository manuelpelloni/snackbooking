const express = require("express");
const router = express.Router();
const db = require("../../database");
const sql = require("mssql");

//users request the list of avaiable products
router.get("/", async (req, res, next) => {
  const result = await db
    .createQuery()
    .query(
      "SELECT id, name, description, price FROM products WHERE deleted_at IS NULL ORDER BY name"
    );
  return res.json(result.recordset);
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const result = await db
    .createQuery()
    .input("id", sql.Int, id)
    .query("SELECT id, name, description, price FROM products WHERE id = @id");
  res.json(result.recordset);
});

//admin add new product
router.post("/", async (req, res, next) => {
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

router.patch("/:id", async (req, res, next) => {
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

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  const result = await db
    .createQuery()
    .input("id", sql.Int, id)
    .query("UPDATE products SET deleted_at = GETDATE() WHERE id = @id");

  res.send();
});

module.exports = router;
