const express = require("express");
const router = express.Router();
const db = require("../../database");
const sql = require("mssql");
const bcrypt = require("bcrypt");
const sendGrid = require("@sendgrid/mail");

//user change password
router.patch("/change", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  const { newPassword, oldPassword, id } = req.body;
  try {
    const result = await db
      .createQuery()
      .input("id", sql.VarChar, id)
      .query("SELECT password_digest, email FROM users WHERE id = @id");

    const { email, password_digest } = result.recordset[0];

    const match = await bcrypt.compare(oldPassword, password_digest);

    if (match) {
      await bcrypt.hash(newPassword, 12, async function (err, hash) {
        if (err) {
          return res.json({
            message: "Qualcosa è andato storto, riprova",
          });
        }

        const result2 = await db
          .createQuery()
          .input("id", sql.Int, id)
          .input("password_digest", sql.VarChar, hash)
          .query(
            `UPDATE users
            SET password_digest = @password_digest
            WHERE id = @id`
          );

        if (!result2.rowsAffected) throw err;

        const msg = {
          to: email,
          from: `${process.env.SUBDOMAIN}@${process.env.DOMAIN}`,
          subject: "DO NOT REPLY",
          html: `<p>La tua password è appena stata cambiata, accedi se non sei statu tu</p>
            <p>
            <a href="https://${process.env.SUBDOMAIN}.${process.env.DOMAIN}">Vai sito</a>
            </p>`,
        };
        sendGrid.send(msg);

        res.json({
          message: "Password cambiata",
        });
      });
    } else {
      res.status(500).json({
        message: "La vecchia password inserita è errata",
        succes: false,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Account non esistente",
      succes: false,
    });
  }
});

//user forgot and reset the password
router.patch("/forgot", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  const { id } = req.params;
  const { new_password } = req.body;

  bcrypt.hash(new_password, 12, async function (err, hash) {
    if (err) {
      return res.json({
        message: "Qualcosa è andato storto, riprova",
      });
    }

    try {
      const result = await db
        .createQuery()
        .input("id", sql.Int, id)
        .input("password_digest", sql.VarChar, hash)
        .query(
          `UPDATE users
           SET password_digest = @password_digest
           WHERE id = @id `
        );

      if (!result.rowsAffected) throw err;

      const msg = {
        to: email,
        from: `${process.env.SUBDOMAIN}@${process.env.DOMAIN}`,
        subject: "DO NOT REPLY",
        html: `<p>La tua password è appena stata cambiata, accedi se non sei statu tu</p>
            <p>
            <a href="https://${process.env.SUBDOMAIN}.${process.env.DOMAIN}">Vai sito</a>
            </p>`,
      };
      sendGrid.send(msg);

      res.json({
        message: "Password cambiata",
      });
    } catch (err) {
      res.status(500).json({
        message: "Account non esistente",
        succes: false,
      });
    }
  });
});

module.exports = router;
