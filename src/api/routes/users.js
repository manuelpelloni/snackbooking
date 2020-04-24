const express = require('express');
const router = express.Router();
const db = require('../../database');
const bcrypt = require('bcryptjs');
const validator = require('validator');

router.post('/signup', async (req, res, next) => {
    const class_number = req.body.class || 1;
    const section =  req.body.section || 'A';
    const admin = req.body.admin || true;
    const email = req.body.email || 'pellonimanuel@gmail.com';
    const digest = req.body.password_digest || 'a';

    if(validator.isEmail(email)){
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(digest, salt, function(err, hash) {
                if(err){
                    return res.status(201).json({
                        message : 'Something gone wrong with yout password, please try again'
                    });
                }else{
                    db.runQuery(`INSERT INTO users(class_number, section, email, password_digest, admin)`
                       +`VALUES ('${class_number}', '${section}', '${email}', '${hash}', '${admin}')`)
                       .then(result => {
                           console.log(result);
                            res.status(201).json({
                                message : 'Success, account Created!'
                            }); 
                        })
                        .catch(err => {
                            res.status(201).json({
                                message : 'Something gone wrong, please try signup again',
                                err : err
                            }); 
                        });
                }
            });
        });
    }
    else{
        res.status(201).json({
            message : 'email not correct or inexistent'
        }); 
    }
;})


module.exports = router;