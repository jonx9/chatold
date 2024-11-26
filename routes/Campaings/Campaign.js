const express = require('express');
const router = express.Router();

router.get('/',(req , res , next)=>{
    res.send({"Vista":"index de Campaña"});
    res.end();
});

module.exports = router;