const socketIO  = require("socket.io")
const socket = {};

function connect(server) {
    return socket.io = socketIO(server)
}

module.exports = {
    connect,
    socket
}