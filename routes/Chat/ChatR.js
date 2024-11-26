const express = require('express');
const Router = express.Router();
const ChatController = require('../../controller/ChatController');


Router.post('setQualificationCode',ChatController.SetQualification)

module.exports = Router;