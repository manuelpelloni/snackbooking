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

  res.send();
});

//read one product info
router.get("/:id", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  if (!user.admin)
    return res.status(403).json({ message: "Non sei un amministratore" });

  console.log(req.params);

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

router.post("/delete-from-cart", async (req, res) => {
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

router.post("/remove-one-from-cart", async (req, res) => {
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

module.exports = router;
