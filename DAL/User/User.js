// CREATE NEW USER.
const { Schema } = require("mongoose");
const UserM = require("../../Models/UserM");

class UserDAL {
  Create = () => {
    const user = new UserM({
      Names: "Cristian Camilo Castrillón",
      Login: "1006",
      Password: "123",
      campaignId: "5fa6011232cbc42a5836e0bf",
    });
    user.save().then((result) => {
      if (result == null) { 
        res.send({ status: 0 });
      }else {
        res.send({ status: 1 });
      }
    });
  };

  GetUserByPassAndLogin = (Login, Password) => {
    return UserM.findOne({ Login, Password });
  };
}

module.exports = UserDAL;

// LIST USERS.
// EDIT USERS.
