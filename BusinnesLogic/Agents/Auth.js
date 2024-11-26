const logger = require("../../common/Utilities/Logger");
const AgentsDAL = require("../../DAL/User/Agents");
const UserDAL = require("../../DAL/User/User");
const AgentService = new AgentsDAL();
const UserService = new UserDAL();
const AuthService = require("../../Services/Auth");

const AuthServices = new AuthService();
class AuthBS {

  Login = async (Login, Password) => {
    logger.insert("Insertando datos login")
    let User = await UserService.GetUserByPassAndLogin(Login, Password);
    if (!User) {
      return null;
    }
    
    // disabled all session data.
    AgentService.ClearSession(User._id);
    const session = await AgentService.CreateSession(User._id);

    return { User, AgentSessionId: session.id };
  };
}

module.exports = AuthBS;
