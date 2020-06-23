const express = require("express");
const router = express.Router();
const db = require("../../database");
const sql = require("mssql");

router.post("/submit", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  try {
    await db.createQuery().input("user_id", sql.Int, user.user_id)
      .query(`UPDATE users 
            SET submitted_at = GETDATE()
            WHERE id = @user_id`);
    res.json({
      message: "Ordine effettuato!",
      err,
    });
  } catch (err) {
    res.json({
      message: "Non è possibile fare l'ordine",
      err,
    });
  }
});

router.post("/cancel", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  try {
    await db.createQuery().input("user_id", sql.Int, user.user_id)
      .query(`UPDATE users 
            SET submitted_at = NULL
            WHERE id = @user_id`);

    res.json({
      message: "Ordine annullato",
      err,
    });
  } catch (err) {
    res.json({
      message: "Non è possibile annullare l'ordine",
      err,
    });
  }
});

router.delete("/", (req, res) => {});
router.patch("/", (req, res) => {});

module.exports = router;
