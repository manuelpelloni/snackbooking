const express = require('express');
const router = express.Router();
const orm = require('sequelize');
const db = require('../../database');


router.get('/', async (req, res, next) => {
    const result = await db.runQuery('SELECT id, name, description, price '
                                    +'FROM products');
    res.status(200).body();

});

 router.post('/:prodId', async (req, res, next) => {
    const name = req.body.name|| 'dsf';
    const description = req.body.description|| 'dsfdsdsfghjkljhjgcxfdzszfxgchvjbnklmjkhgfdsafghsd';
    const price = req.body.price|| 1;
    const result = await db.runQuery('INSERT INTO products(name, description, price)'
                                    +'VALUES (' +name+ ',' +description+ ',' +price+ ')');
    
    
});
router.patch('/', (req, res, next) => {
    res.status(200).json({
        message : 'patch request'
    });
});
router.delete('/', (req, res, next) => {
    res.status(200).json({
        message : 'delete request'
    });
});

module.exports = router;