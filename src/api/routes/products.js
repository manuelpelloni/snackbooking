const express = require("express");
const router = express.Router();
const db = require("../../database");

//users request the list of avaiable products
router.get("/", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  const result = await db.Products.findAll({ order: [["name", "ASC"]] });

  res.json({
    products: result,
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
  const result = await db.Products.create({
    price,
    name,
    description,
  });

  if (!result)
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
  const product = await db.Products.findOne({
    where: { id },
  });

  product.dataValues
    ? res.json({
        ...product.dataValues,
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
  const result = await db.Products.update(
    {
      name,
      description,
      price,
    },
    { where: { id: id } }
  );

  if (!result.dataValues)
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
  const result = await db.Products.destroy({
    where: { id },
  });

  if (!result.dataValues)
    return res
      .status(404)
      .json({ message: "Il prodotto non esiste", success: false });

  res.json({ message: "Prodotto eliminato" });
});

module.exports = router;
