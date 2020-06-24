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

  try {
    await db.createQuery().input("user_id", sql.Int, user.user_id)
      .query(`UPDATE users 
            SET submitted_at = NULL
            WHERE id = @user_id`);

    res.json({
      message: "Ordine annullato",
    });
  } catch (err) {
    res.status(500).json({
      message: "Non è possibile annullare l'ordine",
    });
  }
});

router.delete("/", (req, res) => {});
router.patch("/", (req, res) => {});

module.exports = router;
