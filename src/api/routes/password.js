const express = require("express");
const router = express.Router();
const db = require("../../database");
const bcrypt = require("bcrypt");
const sendGrid = require("@sendgrid/mail");
const { use } = require("bcrypt/promises");
const { where } = require("sequelize/types");

//user change password
router.patch("/change", async (req, res) => {
  const user = await db.checkUserLogin(req, res);
  if (!user) return;

  const {
    newPassword: new_password,
    oldPassword: password,
    id: user_id,
  } = req.body;

  try {
    const { email, password_digest } = user;

    let from_bin_string_digest = "";
    for (var i = 0; i < password_digest.length; ++i) {
      from_bin_string_digest += String.fromCharCode(password_digest[i]);
    }
    console.log(from_bin_string_digest);

    if (match) {
      await bcrypt.hash(new_password, 12, async function (err, hash) {
        if (err) {
          return res.json({
            message: "Qualcosa è andato storto, riprova",
          });
        }

        const pasword_update = await db.UsersProducts.update(
          { password_digest: hash },
          { where: { id: user_id } }
        );

        if (!pasword_update[0][1] != 1) throw err;
        /*
        const msg = {
          to: email,
          from: `${process.env.SUBDOMAIN}@${process.env.DOMAIN}`,
          subject: "DO NOT REPLY",
          html: `<p>La tua password è appena stata cambiata, accedi se non sei statu tu</p>
            <p>
            <a href="https://${process.env.SUBDOMAIN}.${process.env.DOMAIN}">Vai sito</a>
            </p>`,
        };
        await sendGrid.send(msg);
        */

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
    console.log(err);
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
      const result = await db.Users.update({
        password_digest: hash,
        where: {
          id,
        },
      });
      /*
      const result = await db
        .createQuery()
        .input("id", sql.Int, id)
        .input("password_digest", sql.VarChar, hash)
        .query(
          `UPDATE users
           SET password_digest = @password_digest
           WHERE id = @id `
        );
*/
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
