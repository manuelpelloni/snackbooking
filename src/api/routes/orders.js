const express = require("express");
const router = express.Router();
const db = require("../../database");
const sql = require("mssql");

router.post("/submit", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  await db.createQuery().input("user_id", sql.Int, user.user_id)
    .query(`UPDATE users 
            SET submitted_at = GETDATE()
            WHERE id = @user_id`);
});

router.delete("/", (req, res) => {});
router.patch("/", (req, res) => {});

module.exports = router;
