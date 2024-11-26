// CREATE NEW USER.
const { Schema } = require("mongoose");
const AgentM = require('../../Models/AgentsM');
const date = require("../../common/Date");
class AgentsDAL {

  GetAgentSession = async (AgentId) => {
    return await AgentM.findOne({ _id: AgentId, status: 1 })
    .populate("AgentId")
    .populate({
      path: "Chats.RoomId",
      match: { Status: { $ne: 2 } },
    })
  }

  CreateSession = async (id)  =>{
    const SessionAgent = new AgentM({
      CreatedAt: date.get(),
      ActiveChats: 0,
      CloseChats: 0,
      socketId: null,
      status: 1,
      LastChatAssigned: null,
      AgentId : id
    });

    return await SessionAgent.save();
  }

  ClearSession = async (id) => {
    const _filterQ = { AgentId: id, status: 1 };
    const _updateQ = { $set: { status: 0 } };
    return await AgentM.updateMany(_filterQ, _updateQ);
  }
}

module.exports = AgentsDAL


// LIST USERS.
// EDIT USERS.