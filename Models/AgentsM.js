const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AgentM = Schema({
  CreatedAt: Date,
  UpdateAt: Date,
  StopAt: Date,
  StopTime: Number,
  StopCause: Number,
  StopCauseString: String,
  ActiveChats: Number,
  CloseChats: Number,
  LastChatAssigned: Date,
  LostConnection: Date,
  DeteAssign_temp: Date,
  ClosedByKeepAlive: Boolean, // true when the session is finish by Close Alive
  ClosedByKeepAliveAt: Date, 
  Chats: [
    {
      RoomId: {
        type: Schema.Types.ObjectId,
        ref: "Rooms",
        require: true,
      },
      CustomerName: String,
      CreatedAt: String,
      Active: Boolean,
    },
  ],
  AgentId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    require: true,
  },
  socketId: String,
  status: Number, // 1 active.
});

module.exports = mongoose.model("AgenSessions", AgentM);
