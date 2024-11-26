const logger = require("../../common/Utilities/Logger");
const AgentsDAL = require("../../DAL/User/Agents");
const AgentService = new AgentsDAL();
const AuthService = require("../../Services/Auth");
const AuthServices = new AuthService();
class ChatBS {
  Home = async (req, res) => {
    logger.error(req.session)
    AuthServices.CheckAgent(req.session, res);
    const AgentId = req.session.AgentSessionId;
    const Agent = await AgentService.GetAgentSession(AgentId);
    if (Agent == null) {
      AuthServices.RedirectLogin(res);
    }

    return Agent;
  };
}

module.exports = ChatBS;
