// sockets.js
var socketio = require("socket.io");
const users = [];
const connnections = [];
var socketId;
module.exports.listen = function (app) {
  io = socketio.listen(app);
  io.on("connection", (socket) => {
    console.log("New user connected");
    console.log(socket.id);
    //add the new socket to the connections array
    // connnections.push(socket)
    //initialize a random color for the socket
    // let color = randomColor();

    //Set the first username of the user as 'Anonymous'
    socket.username = "Anonymous";
    // socket.color = color;

    //listen on change_username
    socket.on("change_username", (data) => {
      console.log("Ingresando a change username");
      let id = Math.random(); // create a random id for the user
      socket.id = id;
      socket.username = data.nickName;
      users.push({ id, username: socket.username });
      updateUsernames();
    });

    //update Usernames in the client
    const updateUsernames = () => {
      io.sockets.emit("get users", users);
    };

    //listen on new_message
    socket.on("new_message", (data) => {
      //broadcast the new message
      io.sockets.emit("new_message", {
        message: data.message,
        username: socket.username,
        type: data.type,
      });
    });

    //listen on new_message
    socket.on("new_update", (data) => {
      console.log("socket emitido");
    });

    //Disconnect
    socket.on("disconnect", (data) => {
      if (!socket.username) return;
      //find the user and delete from the users list
      let user = undefined;
      for (let i = 0; i < users.length; i++) {
        if (users[i].id === socket.id) {
          user = users[i];
          break;
        }
      }
      users.splice(user, 1);
      //Update the users list
      updateUsernames();
      connnections.splice(connnections.indexOf(socket), 1);
    });

    //listen on typing
    socket.on("typing", (data) => {
      socket.broadcast.emit("typing", { username: socket.username });
    });
  });

  return io;
};
