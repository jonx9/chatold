let io = null;
const _date = require("../common/Date");
const AgentSessionM = require("../Models/AgentsM");

//Queue and Room Manager.
const QueueM = require("../Models/queueM");

// const UpdatePendingQue = (queue)=>{
//     if(queue != null){
//         queue.forEach(q => {
//             io.to(q.SocketClientId).emit('AddRoom',{q});

//         });
//     }
// }

//Check agents Available and stops.
const assing = setInterval(function () {
  // console.log('Session Actualizada',_date.get());
  // const PendingQue =
  //         QueueM.find({"status":0})
  //         .sort({"createdAt":-1})
  //         .then(UpdatePendingQue);
}, 30000);

module.exports = {
  init: function (_io) {
    io = _io;
    assing;
  },
  updateSocketId: function (_io, sessionId, socketId) {
    io = _io;

    const update = {
      socketId: socketId,
      LostConnection: null,
    };
    const filter = {
      _id: sessionId,
    };
    const queue = AgentSessionM.findOneAndUpdate(filter, update).then(
      (result) => {
        return result;
      }
    );
  },
  checkStatus: async function (_io, sessionId) {
    return await AgentSessionM.findOne({ _id: sessionId, status: 1 });
  },
};
