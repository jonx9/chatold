// consumer.js

const QueueManagement = require("../common/QueueManagement");
const ChatManagement = require("../common/ChatManagement");
const AgentManagement = require("../common/AgentSessionManagement");
const ClientManagement = require("../common/ClientManagement");
const date = require("../common/Date");
const Logger = require("../common/Utilities/Logger");
const logger = require("../common/Utilities/Logger");
const KeepAliveManagement = require("./KeepAliveManagement");
// define start method that gets `io` send to it
module.exports = {
  start: function (io) {
    /**
     * SOCKET.IO CHAT CLIENT CONNECT
     */
    const users = [];
    const connetedAgents = [];
    var socketId;
    // Periodically check for inactive games, and delete them
    ChatManagement.init(io);
    KeepAliveManagement.init(io);
    io.on("connection", (socket) => {
      logger.info("new conection");
      Logger.info(socket.id);
      Logger.info(socket.name);
      socket.username = "Anonymous";

      // new customer connect
      socket.on("CustomerConnect", (data) => {
        logger.verbose("CUSTOMER CONNECT");
        socket.username = data.nickName;
        const queueId = data.queueId;
        socket.typeUser = 2;
        socket.queueId = queueId;
        socket.userId = data.UserId;
        const q = QueueManagement.updateSocketId(io, 1, queueId, socket.id);
        //socket actualizado
        socket.join(data.RoomId);
      });

      //AA A NEW USER TO THE AGENT
      socket.on("AddAgentToClient", (data) => {
        socket.join(data.RoomId);
      });

      //listen on change_username
      socket.on("AgentConnect", async (data) => {
        logger.info("Agent Connect");
        logger.select(data);
        const UserId = data.UserId;
        socket.username = data.nickName;
        socket.typeUser = 1;
        socket.userId = UserId;
        const status = await AgentManagement.checkStatus(io, UserId);

        connetedAgents.push({
          socketId: socket.id,
          username: socket.username,
        });

        if (status == null) {
          socket.emit("auth");
        } else {
          // console.log({ connetedAgents });
          QueueManagement.setConnectedAgents(connetedAgents);
          AgentManagement.updateSocketId(io, UserId, socket.id, connetedAgents);
        }
        //socket actualizado
      });

      //Disconnect
      socket.on("disconnect", (data) => {
        Logger.socket("Disconnecting ");
        Logger.socket(socket.userId);
        Logger.socket(socket.username);

        if (socket.userId == null || socket.userId == "") {
          return;
        }
        if (socket.typeUser == 1)
          // find id of connetedAgents and remove object
          connetedAgents.forEach((item, index) => {
            if (item.socketId == socket.id) {
              connetedAgents.splice(index, 1);
            }
          });
        KeepAliveManagement.UpdateKeepAliveAgent(socket.userId);
        if (socket.typeUser == 2)
          KeepAliveManagement.UpdateKeepAliveClient(socket.queueId);
      });

      //Disconnect
      socket.on("CloseSession", async () => {
        if (socket.userId == null || socket.userId == "") {
          return;
        }
        // find id of connetedAgents and remove object
        connetedAgents.forEach((item, index) => {
          if (item.socketId == socket.id) {
            connetedAgents.splice(index, 1);
          }
        });

        await ChatManagement.CloseSession(socket.userId);

        return 200;
      });

      //listen on change_username
      socket.on("EndChat", (data) => {
        const _data = {
          id: socket.userId,
          RoomId: data.RoomId,
          FinishAt: date.get(),
          TypeFinishBy: socket.typeUser,
          FinishBy: socket.username,
          Qualification: data.Qualification,
        };
        logger.socket("end chat event");
        logger.info(_data);

        ChatManagement.Endchat(_data);
        io.sockets.in(data.RoomId).emit("Finish_chat", {
          RoomId: data.RoomId,
        });
      });

      socket.on("GetClientData", async (data) => {
        const RoomId = data.RoomId;
        const result = await ClientManagement.GetClientByRoomId(RoomId);
        io.sockets
          .in(data.RoomId)
          .emit("ClientData", result.Users[0].CustomerId);
        console.log(result);
      });

      //listen on change_username
      socket.on("closeSession", (data, fn) => {
        // logger.socket("Agente Desconectado");
        // logger.socket(data);
        // const UserId = data.UserId;
        // socket.username = data.nickName;
        // socket.typeUser = 1;
        // socket.userId = UserId;
        // const q = AgentManagement.updateSocketId(io, UserId, socket.id);
        // fn(true);
      });

      //listen on new_message
      socket.on("new_message", (data) => {
        //broadcast the new message

        const messageData = {
          RoomId: data.RoomId,
          Type: socket.typeUser,
          SenderId: socket.userId,
          Body: data.message,
          from: socket.username,
          date: date.get(),
        };
        // Logger.verbose(
        //   "________________________|  INICIO MENSAJE |________________________"
        // );
        // logger.socket("Room del mensaje", data.RoomId);
        // logger.socket("ID del socket que envia", socket.id);
        // logger.socket("lista de sockets en la romm");
        logger.socket(io.sockets.in(data.RoomId).adapter.sids);
        logger.socket("socket id " + socket.id);
        logger.info(messageData);
        // Logger.verbose(
        //   "________________________|  FIN DEL NUEVO MENSAJE |________________________"
        // );

        ChatManagement.saveChat(messageData).then((result) => {
          io.sockets.in(data.RoomId).emit("new_message", {
            message: data.message,
            username: socket.username,
            type: data.type,
            RoomId: data.RoomId,
            Chat: result,
          });
        });

        // broadcast the new message.
        // io.sockets.emit('new_message', {message : data.message, username : socket.username,type: data.type});
      });

      //listen on typing
      socket.on("typing", (data) => {
        socket.broadcast.emit("typing", { username: socket.username });
      });
    });
  },
};
