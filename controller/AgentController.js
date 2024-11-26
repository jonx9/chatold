/**
 * name:UserC
 * description: controller for module of Users.
 * Author: Cristian Camilo Castrillon.
 * Date: 2020-11-06
 */

const logger = require("../common/Utilities/Logger");

// SERVICES
const TipificationDAL = require("../DAL/User/Tipification");
const AgentsBSObject = require("../BusinnesLogic/Agents/HomeChat");

const AgentsBS = new AgentsBSObject();
const TipificationService = new TipificationDAL();

exports.Home = async (req, res, next) => {
  const Agent = await AgentsBS.Home(req, res);
  if (Agent == null) { return; }
  const Tipifications = await TipificationService.GetAllTipifications();
  res.render("CHAT/agent", {
    layout: 'agent/mainAgent',
    pageTitle: "Get Users",
    Tipifications: JSON.stringify(Tipifications),
    TipificationsObj: Tipifications,
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    status: Agent?.status || 0,
    validationErrors: [],
    agent: Agent,
    Chats: JSON.stringify(Agent?.Chats.filter((_c) => _c?.RoomId != null)),
    ChatsObject: Agent?.Chats.filter((_c) => _c?.RoomId != null),
  });
};
