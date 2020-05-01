const express = require("express");
const router = express.Router();
const db = require("../../database");
const bcrypt = require("bcrypt");
const validator = require("validator");
const sql = require("mssql");
const { v4: uuidv4 } = require("uuid");

router.post("/signup", async (req, res, next) => {
  const { class_number, section, admin, email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(403).json({
      status: 403,
      message: "Invalid email address",
    });
  }
  bcrypt.hash(password, 12, async function (err, hash) {
    if (err) {
      return res.status().json({
        message: "Something gone wrong with your password, please try again",
      });
    }
    const result = await db
      .createQuery()
      .input("class_number", sql.Int, class_number)
      .input("section", sql.Char, section)
      .input("email", sql.VarChar, email)
      .input("password_digest", sql.VarChar, hash)
      .query(
        "INSERT INTO users(class_number, section, email, password_digest)\
                        VALUES(@class_number, @section, @email, @password_digest)"
      )
      .then((result) => {
        console.log(result);
        res.send.json({
          //TODO-----------------
          message: "Success, account Created!",
        });
      })
      .catch((err) => {
        res.json({
          message: "Something gone wrong, please try signup again",
          err: err,
        });
      });
  });
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const result = await db
    .createQuery()
    .input("email", sql.VarChar, email)
    .query("SELECT id, password_digest FROM users WHERE email = @email");

  const { user_id, password_digest } = result.recordset[0];

  const match = await bcrypt.compare(password, password_digest);
  if (match) {
    const token = uuidv4();
    const result = await db
      .createQuery()
      .input("id", sql.VarChar, token)
      .input("user_id", sql.Int, user_id)
      .query("INSERT INTO sessions(id, user_id) VALUES(@id, @user_id)");

    return res.json({
      token: token,
    });
  } else {
    return res.json({
      message: "To login you must first sign up",
    });
  }
});

module.exports = router;
