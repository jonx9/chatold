let io = null;
const RoomsM = require("../Models/RoomsM");
const date = require("./Date");
const logger = require("./Utilities/Logger");
module.exports = {
  init: (_io) => {
    io = _io;
  },
  GetClientByRoomId: async (CustomerId) => {
    // GET THE CLIENT DATA 
    let filter = { _id: CustomerId };
    return await RoomsM
      .findOne(filter)
      .populate({
        path: "Users.CustomerId"
      })
    
  },

};
