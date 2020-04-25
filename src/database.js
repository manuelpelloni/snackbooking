const sql = require('mssql');

const config = {
    connectionLimit: process.env.CONNECTION_LIMIT,
    server: process.env.DB_HOST,
    user: process.env.DB_ADMIN,
    password: process.env.DB_PSW,
    database: process.env.DB_NAME,
    options: {
        enableArithAbort: false
    }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

function createQuery(){
    return pool.request();
}

module.exports = {createQuery};

