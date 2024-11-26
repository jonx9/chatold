let io = null;

const _date = require("../common/Date");
const { update } = require("../Models/AgentsM");
const AgentsM = require("../Models/AgentsM");
let ActiveQueue = false;
//Queue and Room Manager.
const QueueM = require("../Models/queueM");
const RoomsM = require("../Models/RoomsM");
const logger = require("../common/Utilities/Logger");

const SweepingAgents = (id) => {
  if (queue != null) {
    queue.forEach(async (q) => {
      logger.delete("se encontro un agente para barrer");
      //filter
      const _Agentfilter = {
        status: 1,
        socketId: { $exists: true, $ne: null },
        AgentId: { $exists: true, $ne: "5fd3e7f8ab4212dbe0204482" },
      };
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
      // console.log("se asigno un nuevo chat", _Update);
      await AgentsM.findOneAndUpdate(_Agentfilter, _Update, {
        sort: { ActiveChats: 1, LastChatAssigned: 1 },
      }).then(async (Agents) => {
        if (Agents != null) {
        }
      });
    });
  }
  ActiveQueue = false;
};

const assing = () => {
  logger.update("function keep alive initialize");

  setInterval(async function () {
    const SECONDS_TO_DISCONNECT = -20;
    const SECONDS_TO_LOADPAGE = -30;

    let time = _date.getPlusSeconds(SECONDS_TO_DISCONNECT);

    // UPDATE AGENT WITH LOSTCONNECTION
    let filter = { status: 1, LostConnection: { $ne: null, $lt: time } };
    let update = { status: 0, ClosedByKeepAlive: true };

    await AgentsM.updateMany(filter, update).then((Agents) => {
      logger.info(Agents);
    });

    filter = { status: 0, LostConnection: { $ne: null, $lt: time } };
    update = { status: 3, ClosedByKeepAlive: true };

    await QueueM.updateMany(filter, update).then((Users) => {
      logger.error(Users);
      logger.error(
        "==================================================================="
      );
    });

    // UPDATE AGENT WITHOUT SOCKET ID.

    time = _date.getPlusSeconds(SECONDS_TO_LOADPAGE);
    filter = { status: 1, socketId: null, CreatedAt: { $lt: time } };
    update = {
      status: 0,
      ClosedByKeepAlive: true,
      ClosedByKeepAliveAt: _date.get(),
    };

    AgentsM.updateMany(filter, update).then((Agents) => {
      logger.update(Agents);
    });
  }, 3000);
};
module.exports = {
  init: function (_io) {
    console.log("init function");
    io = _io;
    assing();
  },
  UpdateKeepAliveAgent: async function (id) {
    const update = {
      LostConnection: _date.get(),
    };
    const filter = {
      _id: id,
    };

    if (id == null || id == undefined || id == "") {
      return null;
    }

    logger.warning("KEEP ALIVE DISCONNECT");
    logger.update(filter);
    AgentsM.findOneAndUpdate(filter, update, {
      new: true,
    }).then((result) => {
      return result;
    });
  },

  UpdateKeepAliveClient: async function (queueId) {
    logger.verbose("LOG DISCONECT CLIENT");
    const update = {
      LostConnection: _date.get(),
    };
    const filter = {
      _id: queueId,
    };
    QueueM.findOneAndUpdate(filter, update, {
      new: true,
    }).then((result) => {
      return result;
    });
  },
};
