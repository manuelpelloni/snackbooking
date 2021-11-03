const express = require("express");
const router = express.Router();
const db = require("../../database");
const validator = require("validator");
const bcrypt = require("bcrypt");
const sendGrid = require("@sendgrid/mail");

sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/register", async (req, res) => {
  const { class_section, email, password } = req.body;
  let { year, section } = 0;
  class_section.toUpperCase;
  if (
    class_section.length === 2 &&
    class_section[0] >= 1 &&
    class_section[0] <= 5 &&
    class_section[1].toUpperCase().match(/[A-Z]/i)
  ) {
    year = class_section[0];
    section = class_section[1].toUpperCase();
  } else {
    return res.json({
      status: 403,
      message: "Classe e Sezione non valide",
    });
  }
  if (!validator.isEmail(email)) {
    return res.status(403).json({
      status: 403,
      message: "Indirizzo email non valido",
    });
  }
  await bcrypt.hash(password, 12, async function (err, hash) {
    if (err) {
      return res.json({
        message: "Qualcosa è andato storto, riprova",
      });
    }
    try {
      await db.Users.create({
        class_number: year,
        section: section,
        email: email,
        password_digest: hash,
      });

      const msg = {
        to: email,
        from: `${process.env.SUBDOMAIN}@${process.env.DOMAIN}`,
        subject: "DO NOT REPLY",
        html: `<div>Grazie per esserti registrato a SnackBooking</div>
            <br />
            <div>
            <a href="https://${process.env.SUBDOMAIN}.${process.env.DOMAIN}">Clicca per andare al sito</a>
            </div>`,
      };
      sendGrid.send(msg);

      res.json({
        message: "Account creato!",
      });
    } catch (err) {
      console.log("errore creazione account");
      res.status(500).json({
        message: "Account non creato",
      });
    }
  });
});

router.post("/login", async (req, res) => {
  db.validateCredentialsAndLogin(req, res);
});

router.patch("/logout", async (req, res) => {
  const user = await db.userFromRequest(req);
  if (!user) return res.status(401).json({ message: "Devi prima loggarti" });

  const { user_id, token } = user;

  try {
    await db.Sessions.update({
      expires_at: DataTypes.DATE,
      where: { id: token },
    });
    /*await db
      .createQuery()
      .input("user_id", sql.Int, user_id)
      .input("token", sql.VarChar, token)
      .query(
        "UPDATE sessions\
         SET expires_at = GETDATE()\
         WHERE id = @token"
      );*/

    res.json({
      message: "Logout effettuato con successo",
    });
  } catch (err) {
    res.json({
      message: "Logout non effettuato",
    });
  }
});

module.exports = router;
