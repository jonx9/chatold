let io = null;
let connetedAgents;

const _date = require("../common/Date");
const AgentsM = require("../Models/AgentsM");
let ActiveQueue = false;
//Queue and Room Manager.
const QueueM = require("../Models/queueM");
const RoomsM = require("../Models/RoomsM");
const logger = require("../common/Utilities/Logger");

const UpdatePendingQue = (queue) => {
  if (queue != null) {
    queue.forEach(async (q) => {
      logger.delete("se encontro un registro para actualizar");

      // Find all agents where status = 1 and socketId is not null
      const AgentConnected = await AgentsM.find({
        status: 1,
        socketId: { $exists: true, $ne: null },
        AgentId: { $exists: true, $ne: null },
      });

      const _Update = {
        $inc: { ActiveChats: 1 },
        LastChatAssigned: _date.get(),
        $push: {
          Chats: {
            RoomId: q.RoomId,
            CustomerName: q.CustomerName,
            Active: true,
          },
        },
      };

      console.log("AgentConnected", AgentConnected);

      await AgentsM.findOneAndUpdate(AgentConnected, _Update, {
        sort: { ActiveChats: 0 },
      }).then((Agents) => {
        if (Agents != null) {
          RoomsM.findById(q.RoomId).then((_RommData) => {
            console.log({ connetedAgents });

            //Find Agents.socketId in connetedAgents
            if (connetedAgents != null || connetedAgents != undefined) {
              const _Agent = connetedAgents.find(
                (agent) => agent.socketId === Agents.socketId
              );

              if (_Agent) {
                console.log("_Agent", _Agent);
                io.to(Agents.socketId).emit("AddClient", {
                  Name: _RommData.CreatedBy,
                  RoomId: _RommData,
                });
              } else {
                if (connetedAgents.length > 0) {
                  const random = Math.floor(Math.random() * connetedAgents.length);
                  io.to(connetedAgents[random].socketId).emit("AddClient", {
                    Name: _RommData.CreatedBy,
                    RoomId: _RommData,
                  });
                  console.log("Se asigno un nuevo agente");
                } else {
                  console.log("No encontro el agente");
                }
              }
            }

            io.to(q.SocketClientId).emit("AddRoom", { q });
            const _filterQ = { _id: q.id };
            const _updateQ = {
              status: 1,
              AgentId: Agents._id,
              AgentAssignedAt: _date.get(),
            };
            QueueM.findOneAndUpdate(_filterQ, _updateQ).then((data) => {
              console.log("se actualizo el registro", data);
            });
          });
        }
      });
    });
  }
  ActiveQueue = false;
};

const assing = setInterval(async function () {
  // console.log('Session Actualizada',_date.get());
  if (ActiveQueue) {
    console.log("------------- consulta activa deteniendo");
  }
  {
    ActiveQueue = true;
    await QueueM.find({ status: 0 })
      .sort({ createdAt: -1 })
      .then(UpdatePendingQue);
  }
}, 1000);

function setConnectedAgents (agents) {
  connetedAgents = agents;
}

module.exports = {
  init: function (_io) {
    io = _io;
    assing;
  },
  updateSocketId: function (_io, type, queueId, socketId) {
    io = _io;
    const update = {
      SocketClientId: socketId,
      LostConnection: null,
    };
    const filter = {
      id: queueId,
    };
    const queue = QueueM.findOneAndUpdate({ _id: queueId }, update, {
      new: true,
    }).then((result) => {
      return result;
    });
  },
  setConnectedAgents,
};
