const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QueueM = Schema({
  CustomerId: {
    type: Schema.Types.ObjectId,
    ref: "Customers",
    required: false,
  },
  AgentId: {
    type: Schema.Types.ObjectId,
    ref: "AgenSessions",
    required: false,
  },

  RoomId: {
    type: Schema.Types.ObjectId,
    ref: "Rooms",
    require: true,
  },
  SocketClientId: String,
  SocketAgentId: String,
  createdAt: Date,
  AgentAssignedAt: Date,
  status: Number, // 0 not attended
  Type: Number, // 1 - normal attention
  CustomerName: String,
  LostConnection: Date,
  ClosedByKeepAlive: Boolean,
});

module.exports = mongoose.model("queue", QueueM);
