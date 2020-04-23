const express = require('express');
const router = express.Router();
const db = require('../../database');

//users request the list of avaiable products
router.get('/list', async (req, res, next) => {
    const result = await db.runQuery('SELECT id, name, description, price '
                                    +'FROM products');
    res.status(200).body();

});

//admin add new product
 router.post('/new-product', async (req, res, next) => {
    const name = req.body.name || 'roba a caso';
    const desc = req.body.description || 'roba a caso2';
    const price = req.body.price || 1;
    const result = await db.runQuery(`INSERT INTO products(name, description, price)`
                                    +`VALUES ('${name}', '${desc}', ${price})`);
});

router.patch('/', (req, res, next) => {
    res.status(200).json({
        message : 'patch request'
    });
});

router.delete('/delete-product/:id', async (req, res, next) => {
    const id = req.id;
    const result = await db.runQuery(`DELETE FROM`
                                    +`WHERE id = ${id}`);
});

module.exports = router;