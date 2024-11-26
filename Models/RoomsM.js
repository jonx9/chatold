const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomsM = Schema({
  Users: [
    {
      CustomerId: {
        type: Schema.Types.ObjectId,
        ref: "Customers",
        required: false,
      },
      UsersId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: false,
      },
      UsersName: String,
      UsersLogin: String,
      typeName: String,
      typeId: Number, // 1 - customer , 2 - client
      InAt: Date,
    },
  ],
  conversation: [
    {
      from: String,
      to: String,
      CustomerId: {
        type: Schema.Types.ObjectId,
        ref: "Customers",
        required: false,
      },
      UsersId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: false,
      },
      sent: Date,
      body: String,
      typeMessage: String,
      encoding: String,
      Sender: Number, //Who Send the messate 1-Agent, 2 - client , 3 - system
    },
  ],
  CreatedAt: Date,
  CreatedBy: String,
  TypeCreatedBy: Number, // 1- customer, 2- agent
  FinishAt: Date,
  FinishBy: String,
  TypeFinishBy: Number, // 1 - customer - 2 agent
  SaludationCustomerAt: Date,
  SaludationAgentAt: Date,
  Status: Number, // 0 - not started - 1 - Inchat - 2 finish
  Final: String,
  TypeFinal:String,
  FinalsId: {
    type: Schema.Types.ObjectId,
    ref: "Finals",
    required: false,
  }
});

module.exports = mongoose.model("Rooms", RoomsM);
