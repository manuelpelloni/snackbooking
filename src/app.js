const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const productsRoute = require('./api/routes/products');
const ordersRoute = require('./api/routes/orders');
const usersRoute = require('./api/routes/users');

/*
app.use((req, res, next) => {
    res.status(200).json({
        message: 'It works!'
    });
});*/
app.use(function (req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');  
    next();  
}); 

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/users', usersRoute);
app.use('/products', productsRoute);
app.use('/orders', ordersRoute);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status(404);
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;