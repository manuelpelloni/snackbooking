const express = require("express");
const router = express.Router();
const db = require("../../database");

router.post("/submit", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  await db.createQuery().query(`UPDATE users 
            SET submitted_at = GETDATE()
            WHERE id = ${user.user_id}`);
});

router.delete("/", (req, res) => {});
router.patch("/", (req, res) => {});

module.exports = router;
