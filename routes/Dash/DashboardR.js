const express = require('express');
const Router = express.Router();
const DashController = require('../../controller/DashController');

Router.get('/agents',DashController.AgentsOnline);

Router.get('/history',DashController.ChatHistory);

Router.get('/queue',DashController.ChatQueue);

Router.get('/questions',DashController.RenderQuestion);

Router.get('/detail/:id',DashController.ChatDetail);

Router.post('/questions',DashController.SaveQuestion);

Router.post('/history',DashController.ChatHistory);

module.exports = Router;