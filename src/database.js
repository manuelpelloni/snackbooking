const sql = require("mssql");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const cookieSessionValidity = 1000 * 60 * 60 * 24 * 30; // 30 days

const config = {
  connectionLimit: process.env.CONNECTION_LIMIT,
  server: process.env.DB_HOST,
  user: process.env.DB_ADMIN,
  password: process.env.DB_PSW,
  database: process.env.DB_NAME,
  options: {
    enableArithAbort: false,
  },
};
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

function createQuery() {
  return pool.request();
}

async function userFromToken(token) {
  const result = await createQuery()
    .input("token", sql.VarChar, token)
    .query(
      "SELECT users.id as user_id, CONCAT(users.class_number, users.section) as class, users.email, users.admin,\
              orders.id as order_id\
      FROM sessions\
      	INNER JOIN users on users.id = sessions.user_id\
	      JOIN orders on orders.user_id = users.id\
        WHERE sessions.id =  @token and getdate() <= expires_at"
    );

  return result.recordset[0];
}

async function userFromRequest(req) {
  const { session } = req.cookies;
  if (!session) return null;

  return userFromToken(session);
}

async function validateCredentialsAndLogin(req, res) {
  const { email, password } = req.body;
  const result = await createQuery()
    .input("email", sql.VarChar, email)
    .query(
      "SELECT id AS user_id, password_digest FROM users WHERE email = @email"
    );

  const { user_id, password_digest } = result.recordset[0];

  const match = await bcrypt.compare(password, password_digest);
  if (match) {
    const token = uuidv4();
    await createQuery()
      .input("id", sql.VarChar, token)
      .input("user_id", sql.Int, user_id)
      .query("INSERT INTO sessions(id, user_id) VALUES(@id, @user_id)");

    res.cookie("session", token, {
      maxAge: cookieSessionValidity,
      httpOnly: true,
    });
    return res.send("");
  } else {
    return res.json({
      message: "Devi registrarti prima di fare il login",
    });
  }
}

module.exports = {
  createQuery,
  userFromToken,
  validateCredentialsAndLogin,
  userFromRequest,
};
