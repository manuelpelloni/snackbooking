const express = require('express');
const router = express.Router();
const db = require('../../database');
var bcrypt = require('bcryptjs');

router.post('/signup', async (req, res, next) => {
    const class_number = req.body.class || null;
    const section = req.body.section || null;
    const admin = req.body.admin || 0;
    const email = req.body.email || 'ciao';
    const digest = req.body.password_digest || 'ciao';
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(digest, salt, function(err, hash) {
            if(err) throw err;
            db.runQuery(`INSERT INTO users(class_number, section, email, password_digest, admin)`
                       +`VALUES (${class_number}, '${section}', '${email}', '${hash}', ${admin})`);
        });
    });
;})

module.exports = router;