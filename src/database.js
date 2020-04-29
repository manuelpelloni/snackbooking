const sql = require("mssql");

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

async function tokenValidator(res, token){
  const result = await db.createQuery()
    .input("token", sql.validator, token)
    .query('SELECT users.id, CONCAT(users.class_number, users.section) as class, users.email, users.admin\
            FROM sessions INNER JOIN users on users.id = sessions.user_id\
            WHERE sessions.id = @token and getdate() <= expires_at')

    console.log(result.recordset[0]);
    return result.recordset[0];
}

module.exports = { createQuery, tokenValidator };
