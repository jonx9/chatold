const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionM = Schema({
  CreatedAt: Date,
  UpdateAt: Date,
  Phone: String,
  Channel: String,
  Name: String,
  LevelOfSatisfaction: String,
  CustomerId: {
    type: Schema.Types.ObjectId,
    ref: "Customers",
    required: true,
  },
  AgentId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: false,
  },
  RoomId: {
    type: Schema.Types.ObjectId,
    ref: "Rooms",
    require: true,
  },
});

module.exports = mongoose.model("questions", QuestionM);