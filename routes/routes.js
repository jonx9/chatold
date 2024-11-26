const express = require('express');
const router = express.Router();

const CampaingsRoutes = require('./Campaings/Campaign');
const UserRoutes = require('./Users/usersR');
const AuthRoutes = require('./auth/authR');
const AgentRoutes = require('./Users/agentR');
const ChatRoutes = require('./Chat/ChatR');
const CustomerRoutes = require('./customer/CustomerR');
const DashboardRoutes = require('./Dash/DashboardR');

router.use("/campaign", CampaingsRoutes);
router.use("/user", UserRoutes);
router.use("/auth", AuthRoutes);
router.use("/Agent", AgentRoutes);
router.use("/Customer", CustomerRoutes);
router.use("/Dash", DashboardRoutes);
router.use("/Chats", ChatRoutes);


router.get('/', (req, res, next) => {
    res.redirect("auth/login");
});

router.use((req, res, next) => {
    res.render('common/Not_found', { pageTitle: "La pagina no existe" });
});

module.exports = router;