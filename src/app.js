const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const productsRoute = require('./api/routes/products');
const ordersRoute = require('./api/routes/orders');

/*
app.use((req, res, next) => {
    res.status(200).json({
        message: 'It works!'
    });
});*/
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/products', productsRoute);
app.use('/orders', productsRoute);

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