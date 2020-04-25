const express = require('express');
const router = express.Router();
const db = require('../../database');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const sql = require('mssql');

router.post('/signup', async (req, res, next) => {
    const class_number = req.body.class || 1;
    const section =  req.body.section || 'A';
    const admin = req.body.admin || true;
    const email = req.body.email || 'pellonimanuel@gmail.com';
    const digest = req.body.password_digest || 'a';

    if(!validator.isEmail(email)){
        return res.status(403).json(
            {
                status: 403,
                message: 'Invalid email address'
            }
        );
    };

    bcrypt.genSalt(12, function(err, salt) {
        bcrypt.hash(digest, salt, function(err, hash) {
            if(err){
                return res.status().json({
                    message : 'Something gone wrong with yout password, please try again'
                });
            }
            db.createQuery()
                .input('class_number', sql.Int, class_number)
                .input('section', sql.Char, section)
                .input('email', sql.VarChar, email)
                .input('password_digest', sql.VarChar, password_digest)
                .query('INSERT INTO users(class_number, section, email, password_digest)\
                        VALUES(@class_number, @section, @email, @password_digest)')
                .then(result => {
                    console.log(result);
                    res.send.json({
                        message : 'Success, account Created!'
                    }); 
                })
                .catch(err => {
                    res.json({
                        message : 'Something gone wrong, please try signup again',
                        err : err
                    }); 
                });
        });
    });
;})


module.exports = router;