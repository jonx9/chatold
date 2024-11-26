const logger = require("../common/Utilities/Logger");

class AuthService {
    CheckAgent = (session, res) => {

        if (session.AgentSessionId == null)
            this.RedirectLogin(res);
    }
    RedirectLogin = (res) => {
        res.redirect("/Auth/login");
        return false;
    }

}


module.exports = AuthService;