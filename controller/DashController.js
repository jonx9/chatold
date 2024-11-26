const { Schema } = require("mongoose");
const { response, json } = require("express");
const AgentsM = require("../Models/AgentsM");
const QueueM = require("../Models/queueM");
const UserM = require("../Models/UserM");
const CustomerM = require("../Models/CustomerM");
const RoomsM = require("../Models/RoomsM");
const ConvertDate = require("../common/Date");
const QuestionM = require("../Models/QuestionM");
const moment = require("moment");
const logger = require("../common/Utilities/Logger");

// Función que renderiza los agentes que se encuentran activos y en línea.
exports.AgentsOnline = async (req, res, next) => {
  const _Agentfilter = {
    status: 1,
    socketId: { $exists: true, $ne: null },
    AgentId: { $exists: true, $ne: "5fd3e7f8ab4212dbe0204482" },
  };
  const data = AgentsM.find({ status: { $gt: 0 } }, null, {
    sort: { ActiveChats: -1, LastChatAssigned: 1 },
  })
    .populate("AgentId")
    .then(async (response) => {
      res.locals.formatDate = ConvertDate;

      // DATOS PARA VERIFICAR EL PROXIMO EN LA COLA.

      const _Agentfilter = {
        status: 1,
        socketId: { $exists: true, $ne: null },
        AgentId: { $exists: true, $ne: "5fd3e7f8ab4212dbe0204482" },
      };
      const _Update = { DeteAssign_temp: ConvertDate.get() };
      //,
      const options = {
        new: true,
      };
      // console.log("se asigno un nuevo chat", _Update);
      await AgentsM.findOneAndUpdate(_Agentfilter, _Update, {
        sort: { ActiveChats: 1, LastChatAssigned: 1 },
        new: true,
      }).then((data) => {
        logger.insert(data);
      });

      res.render("Dash/agentsOnline", {
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: "An error Ocurred!" + error,
      });
    });
};

// Función que renderiza la historia de los chats.
exports.ChatHistory = (req, res, next) => {

  let startDate = req.body.starDate,
    endDate = req.body.endDate,
    nameAgent = req.body.nameAgent,
    documentCustomer = req.body.documentCustomer;

  // let AgentIdByName = await UserM.findOne({ "Names": { $regex: '.*' + nameAgent + '.*', $options: 'i'} });
  // let customerIdByDocument = await CustomerM.findOne({ "document": { $regex: '.*' + documentCustomer + '.*', $options: 'i'} });

  const data = QueueM.find({
    status: { $gt: 0 },
  })
    .populate("CustomerId")
    .sort({ createdAt: -1 })
    .populate("RoomId")
    // .populate("AgentId")
    .populate({
      path: "AgentId",
      model: "AgenSessions",
      ñpopulate: { path: "AgentId", model: "Users" },
    })
    .then((response) => {
      res.render("Dash/chatHistory", {
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: "An error Ocurred!",
      });
    });
};

// Función que renderiza el listado de usuarios en cola.
exports.ChatQueue = (req, res, next) => {
  const data = QueueM.find({ status: 0 })
    .populate("CustomerId")
    .populate("RoomId")
    .then((response) => {
      res.render("Dash/chatQueue", {
        response: JSON.stringify(response),
      });
    })
    .catch((error) => {
      res.json({
        message: "An error Ocurred!",
      });
    });
};

// Función que renderiza el formulario para la encuesta.
exports.RenderQuestion = (req, res, next) => {
  res.render("Dash/chatQuestions");
};

// Función que guarda el resultado de la encuesta.
exports.SaveQuestion = (req, res, next) => {
  const customerId = req.session.CustomerId;
  const roomId = req.session.Room;

  const newQuestion = new QuestionM({
    CreatedAt: new Date(),
    Phone: req.body.Phone,
    Channel: req.body.Channel,
    Name: req.body.Name,
    LevelOfSatisfaction: req.body.LevelOfSatisfaction,
    CustomerId: customerId,
    RoomId: roomId,
  });

  newQuestion
    .save()
    .then(console.log("the questions have been answered."))
    .catch((err) => handleError(err));
};

// Función que retorna el detalle del chat.
exports.ChatDetail = (req, res, next) => {
  const queueId = req.params.id;
  QueueM.findOne({ _id: queueId, status: 1 })
    .populate({
      path: "AgentId",
      model: "AgenSessions",
      populate: { path: "AgentId", model: "Users" },
    })
    .populate("RoomId")
    .populate("CustomerId")
    .then((response) => {
      if (response != null) {
        var Chats = JSON.stringify(response.RoomId.conversation);
        res.render("Dash/chatDetail", {
          response,
          Chats,
        });
      }
    })
    .catch((error) => {
      res.json({
        message: "An error Ocurred!",
      });
    });
};
