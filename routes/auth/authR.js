const express = require('express');
const AuthController = require('../../controller/authController');
const router = express.Router();


router.get('/login',AuthController.login);
router.post('/loginPost',AuthController.Postlogin);
router.post('/LogoutAgent',AuthController.LogoutAgent);

module.exports = router;