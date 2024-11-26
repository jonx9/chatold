let io = null;
const RoomsM = require("../Models/RoomsM");
const AgentsM = require("../Models/AgentsM");
const date = require("../common/Date");
const logger = require("../common/Utilities/Logger");
const queueM = require("../Models/queueM");
module.exports = {
  init: (_io) => {
    io = _io;
  },
  saveChat: async (data) => {
    //filter
    const Filter = {
      _id: data.RoomId,
    };

    let message = {
      from: data.from,
      sent: date.get(),
      body: data.Body,
      Sender: data.Type, //Who Send the messate 1-Agent, 2 - client , 3 - system
      encoding: "html",
    };
    TypeName = data.Type == 2 ? "CustomerId" : "UsersId";

    message[TypeName] = data.SenderId;

    const Update = {
      $push: {
        conversation: {
          from: data.from,
          sent: data.date,
          body: data.Body,
          typeMessage: "text",
          encoding: "html",
          Sender: data.Type,
        },
      },
    };

    await RoomsM.findOneAndUpdate(Filter, Update);
    return message;
  },
  Endchat: async (data) => {
    const _Agentfilter = {
      _id: data.id,
      // Chats : { $elemMatch : { RoomId : }}
      "Chats.RoomId": data.RoomId,
    };
    const _Update = {
      $inc: { ActiveChats: -1, CloseChats: 1 },
      $set: { "Chats.$.Active": false },
    };

    const _RoomFilter = {
      _id: data.RoomId,
      Status: { $ne: 2 },
    };
    const _RoomUpdate = {
      Status: 2,
      FinishAt: data.FinishAt,
      TypeFinishBy: data.TypeFinishBy,
      FinishBy: data.FinishBy,
      Final: data.Qualification?.Name,
      TypeFinal: data.Qualification?.category,
      FinalsId: data.Qualification?.Id,
    };

    await AgentsM.findOneAndUpdate(_Agentfilter, _Update);
    await RoomsM.findOneAndUpdate(_RoomFilter, _RoomUpdate);
  },

  CloseSession: async (AgentId) => {
    // UPDATE AGENT WITH LOSTCONNECTION
    let filter = { status: 1, _id: AgentId };
    let update = { status: 0, StopAt: date.get(), StopCauseString: "Cierra Sesion" };
    const Result = await AgentsM.updateMany(filter, update).then((Agents) => { });


  },

};
