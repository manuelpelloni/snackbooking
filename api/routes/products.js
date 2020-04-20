const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message : 'get request'
    });
});
router.post('/:prodId', (req, res, next) => {
    const id = req.params.prodId;
    if(id === 'something'){
        res.status(200).json({
            message : 'post request',
            info: 'specal sandwich'

        });
    }else{
        res.status(200).json({
            message : 'post request',
            info: 'no specal sandwich'

        });
    }
    
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