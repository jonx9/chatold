/**
 * name:authController
 * description: auth for user of the chat
 * Author: Cristian Camilo Castrillon.
 * Modify: Jhon Arcila Castano
 * Date: 2020-12--11
 */

const date = require("../common/Date");
const AgentM = require("../Models/AgentsM");
const UserM = require("../Models/UserM");
const AuthBusinessLogic = require('../BusinnesLogic/Agents/Auth');
const logger = require("../common/Utilities/Logger");
const AuthBS = new AuthBusinessLogic();

exports.login = async (req, res, next) => {
  res.render("Auth/login");
};

exports.Postlogin = async (req, res, next) => {
  const Login = req.body.login;
  const Password = req.body.password;
  const Agent = await AuthBS.Login(Login, Password);

  logger.insert("Insertando datos login");
  logger.socket(Agent);
  if (Agent == null) {
    res.redirect("/Auth/login");
  } else {
    req.session.AgentId = Agent.User._id;
    req.session.Name = Agent.User.Names;
    req.session.AgentSessionId = Agent.AgentSessionId;
    res.redirect("/Agent/home");
  }
};

exports.LogoutAgent = (req, res, next) => {
  const filter = { AgentId: req.session.AgentId, status: 1 };
  const update = { $set: { status: 0 } };
  LogoutAgentAndSetinactive(filter, update);
};

exports.Setinactive = (req, res, next) => {
  const filter = { AgentId: req.session.AgentId, status: 1 };
  const update = { $set: { status: 0, StopAt: date.get() } };
  LogoutAgentAndSetinactive(filter, update);
};

function LogoutAgentAndSetinactive(filter, update) {
  try {
    AgentM.updateMany(filter, update);

    req.session.AgentSessionId;
    req.session.Name = AgentM.Name;
    req.session.AgentId = AgentM._id;
    res.redirect("/Auth/login");
  } catch (error) {
    logger.insert(error);
  }
}
