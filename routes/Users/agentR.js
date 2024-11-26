const express = require('express');
const AgentController = require('../../controller/AgentController');
const router = express.Router();


router.get('/home', AgentController.Home);

module.exports = router;