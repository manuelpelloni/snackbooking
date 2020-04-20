
const sql = require('mssql');

const config = {
    server: 'dbpanini.cyuo0nk2xq8n.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'Progetto2020',
    database: 'DBPanini',
    options: {
        enableArithAbort: false
    }
};
/*
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect((err, conn) => {
    if(err){
        console.log(err);
    }
    else{
        conn.query('select * from Panini');
    }

})

pool.on('error', err => {
    // ... error handler
    console.log("pool created!");

    console.log(err, err.name);
});

    return poolConnect.then((pool1) => {
        pool1.request() // or: new sql.Request(pool2)
        .query``+query+``
        .then((err, result) => {
            // ... error checks
            return result;
            
        })
    }).catch(err => {
        // ... error handler
    })
}*/
 
