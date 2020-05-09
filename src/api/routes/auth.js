const express = require("express");
const router = express.Router();
const db = require("../../database");
const validator = require("validator");
const bcrypt = require("bcrypt");
const sql = require("mssql");

router.post("/register", async (req, res) => {
  const { class_section, email, password } = req.body;
  let { year, section } = 0;

  if (
    class_section.length === 2 &&
    class_section[0] >= 1 &&
    class_section[0] <= 5 &&
    class_section[1].toUpperCase().match(/[A-Z]/i)
  ) {
    year = class_section[0];
    section = class_section[1];
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
  bcrypt.hash(password, 12, async function (err, hash) {
    if (err) {
      return res.json({
        message: "Qualcosa è andato storto, riprova",
      });
    }
    try {
      const result = await db
        .createQuery()
        .input("class_number", sql.Int, year)
        .input("section", sql.Char, section)
        .input("email", sql.VarChar, email)
        .input("password_digest", sql.VarChar, hash)
        .query(
          "INSERT INTO users(class_number, section, email, password_digest)\
                          VALUES(@class_number, @section, @email, @password_digest)"
        );
      res.json({
        message: "Account creato!",
      });
    } catch (err) {
      res.json({
        message: "Account non creato",
      });
    }
  });
});

router.post("/login", async (req, res) => {
  db.validateCredentialsAndLogin(req, res);
});

module.exports = router;
