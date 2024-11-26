//chat.js

class ChatDetail extends ChatUtilities {
  constructor() {
    super();
    (this.CurrentRoom = null), (this.socket = null);
    this.Doom = {
      // let message = $("#message");
      // let send_message = $("#send_message");
      // let chatroom = $("#chatroom");
      // let feedback = $("#feedback");
      // let usersList = $("#users-list");
      // let nickName = $("#nickname-input");
      Form: {
        message: $("#message"),
        send_message: $("#send_message"),
        chatroom: $("#chatroom"),
        feedback: $("#feedback"),
        body: $("body"),
        chatWindow: $("#chatFormFull"),
        customerLabel: $("#CustomerName"),
        endChat: $("#finalizarChat"),
      },
    };

    this.Chats = Chats;
    this.currentMessages = Chats;

    this.Customer = {
      Name: null,
      QueueId: null,
      UserId: null,
    };

    this.initial();
  }

  // connect with socket
  connectToSocket = () => {
    const SOCKET_URL = this.SocketUrl;
    let socket = io.connect(SOCKET_URL);
    this.socket = socket;
  };

  NewMessageEvent = (data) => {   
    const Form = this.Doom.Form;
    Form.chatroom.append(this.GetMessageStructure(data));
    this.keepTheChatRoomToTheBottom();
  };

  MessageEmmit = (e) => {
    this.socket.emit("new_message", {
      message: this.Doom.Form.message.val(),
      RoomId: this.CurrentRoom,
    });
    this.Doom.Form.message.val("");
  };

  showForm = () => {
    this.Doom.Form.chatWindow.show();
    this.Doom.Form.customerLabel.text(this.Customer.Name);
  };

  FinishChat = () => {
    window.location = "./end";
  };

  Endchat = (data) => {
    this.socket.emit("EndChat", { type: 1, RoomId: this.CurrentRoom });
  };



  initial = () => {

    //events
    this.Doom.Form.send_message.click(this.MessageEmmit);
    this.Doom.Form.endChat.click(this.Endchat);
    this.Doom.Form.message.keypress((e) => {
      let keycode = e.keyCode ? e.keyCode : e.which;
      if (keycode == "13") {
        this.MessageEmmit();
      }
    });

    // triggers.
    this.fillMessage();

    // funciones pendientes
  };
}


