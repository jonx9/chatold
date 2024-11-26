//chat.js

class Agent extends ChatUtilities {
  constructor() {
    super();
    (this.CurrentRoom = null),
      (this.socket = null),
      (this.currentMessages = []);
    this.Doom = {
      Form: {
        message: $("#message"),
        send_message: $("#send_message"),
        chatroom: $("#chatroom"),
        feedback: $("#feedback"),
        body: $("body"),
        chatWindow: $("#chatFormFull"),
        customerLabel: $("#CustomerName"),
        endChat: $("#finalizarChat"),
        Qualification: $("#selectTipificar"),
      },
      Session: {
        Logout: $("#BtnLogout"),
      },
      InformationUpdate: {},
    };
    this.Chats = ChatData;
    this.Agent = {
      UserName: UserName,
      UserId: UserId,
    };
    this.Tipifications = Tipifications;
    this.CurrentTipifications = null;
    this.Customer = {
      Name: null,
    };
    this.connectToSocket();
    this.initial();
  }

  // conect with socket
  connectToSocket = () => {
    try {
      const SOCKET_URL = this.SocketUrl;
      let socket = io.connect(SOCKET_URL);
      this.socket = socket;
      console.log("conectado con el servidor");
    } catch (error) {
      //redirect to login
      console.log(error);
      alert('No se pudo conectar con el servidor, por favor intente de nuevo');
    }
  };

  NewClientEvent = (data) => {
    console.log("nuevo usuario conectado", data);
    this.EmitConnectNewClient(data.RoomId._id);
    this.AddClientToMenuAndData({
      Name: data.Name,
      RoomId: data.RoomId._id,
      Chat: data.RoomId,
    });
  };

  EmitConnectNewClient = (RoomId) => {
    this.socket.emit("AddAgentToClient", { RoomId: RoomId });
  };

  AddClientToMenuAndData = (data) => {
    $(".chatMenuAgent").prepend(this.GetMenustructure(data));
    this.AddDataStore({
      Active: true,
      CustomerName: "cristian",
      RoomId: data.Chat,
      _id: null,
    });
  };

  FinishChat = (data) => {
    $(".ChatClientItem[data-roomid='" + data.RoomId + "']").remove();
    this.RemoveDataStore(data.RoomId);
    this.ClearWindows();
  };

  Endchat = (data) => {
    if (this.CurrentRoom == null) {
      alert("no hay ningun chat seleccionado");
      return;
    }

    if (this.CurrentTipifications == null) {
      alert("no se ha seleccionado la tipificacion");
      return;
    }

    try {
      this.socket.emit("EndChat", {
        type: 1,
        RoomId: this.CurrentRoom,
        Qualification: this.CurrentTipifications,
      });
      this.CurrentTipifications = null;
      this.CurrentRoom = null;
      this.Doom.Form.customerLabel.text("");
      this.Doom.Form.Qualification.val(0);
      this.Doom.Form.chatWindow.Hide();
    } catch (error) {}
  };

  CloseSession = async (data) => {
    try {
      await this.socket.emit("CloseSession");
      window.location.reload();
    } catch (error) {}
  };

  // InformationUpdate = (d) => {
  //   console.log(d)
  // };

  // CloseSession = () => {
  //   this.socket.emit("CloseSession", {}, (d) => {
  //     this.InformationUpdate(d);
  //   });
  // };

  updateTipification() {
    const q = this.Doom.Form.Qualification;
    if (q.val() == 0) {
      this.CurrentTipifications = null;
      return;
    }
    this.CurrentTipifications = {
      Id: q.val(),
      Name: q.find("option:selected").text(),
      category: q.find("option:selected").parent()[0].label,
    };
  }

  NewMessageEvent = (data) => {
    const Form = this.Doom.Form;
    this.AddMessageToDataStorage(data.Chat, data.RoomId);
    if (this.CurrentRoom == data.RoomId) {
      let _data = {
        type: data.Chat.Sender,
        date: data.Chat.sent,
        message: data.Chat.body,
        username: data.Chat.from,
      };

      this.Doom.Form.chatroom.append(this.GetMessageStructure(_data));
    } else {
      this.IncrementChatLabelNumber(data.RoomId);
    }
    this.keepTheChatRoomToTheBottom();
    if (data.Chat.Sender == 2) this.SetNotification();
  };

  IncrementChatLabelNumber = (RoomId) => {
    let label = $(".ChatClientItem[data-roomid='" + RoomId + "']").find(
      ".ui.teal.left.pointing.label"
    );
    const InitialNumber = parseInt(label.html());

    if (!isNaN(InitialNumber)) {
      const NewNumber = InitialNumber + 1;
      label.html(NewNumber);
    }
  };

  RessetChatLabelNumber = (RoomId) => {
    let label = $(".ChatClientItem[data-roomid='" + RoomId + "']").find(
      ".ui.teal.left.pointing.label"
    );
    label.html(0);
  };

  MessageEmmit = (e) => {
    if (this.CurrentRoom == null) {
      alert("no hay ningun chat seleccionado");
      return;
    }
    this.socket.emit("new_message", {
      message: this.Doom.Form.message.val(),
      type: 1,
      RoomId: this.CurrentRoom,
    });
    this.Doom.Form.message.val("");
  };

  showForm = () => {
    this.Doom.Form.chatWindow.show();
    this.Doom.Form.customerLabel.text(this.Customer.Name);
  };

  SetClientChat = (data) => {
    const Element = $(data.target);
    const RoomId = Element.data("roomid");
    const CustomerName = Element.data("name");
    this.CurrentRoom = RoomId;
    this.Customer.Name = CustomerName;
    console.log("emit data");
    this.socket.emit("GetClientData", { RoomId: RoomId });

    $(".ChatClientItem").removeClass("active");
    Element.addClass("active");

    let _chat = this.Chats.filter((chat) => {
      return chat.RoomId._id == RoomId;
    })[0];
    if (_chat != null) {
      this.currentMessages = _chat.RoomId.conversation;
    }

    this.fillMessage();
    this.showForm();
    this.RessetChatLabelNumber(RoomId);
  };

  updateChatsRooms() {
    this.Chats.forEach((chat) => {
      this.EmitConnectNewClient(chat.RoomId._id);
    });
  }

  SetClientData(data) {
    console.log(data);
    $("#Userdata_Nombre").text(data.Name);
    $("#Userdata_Email").text(data.email);
    $("#Userdata_Tel").text(data.Phone);
  }

  initial = () => {
    let data = { nickName: this.Agent.UserName, UserId: this.Agent.UserId };

    //definitions

    this.updateChatsRooms();

    //events
    this.Doom.Form.send_message.click(this.MessageEmmit);
    this.Doom.Form.endChat.click(this.Endchat);
    this.Doom.Session.Logout.click(this.CloseSession);
    this.Doom.Form.Qualification.change(() => {
      this.updateTipification();
    });
    this.Doom.Form.message.keypress((e) => {
      let keycode = e.keyCode ? e.keyCode : e.which;
      if (keycode == "13") {
        this.MessageEmmit();
      }
    });
    this.Doom.Form.body.on("click", ".ChatClientItem", this.SetClientChat);

    // triggers.
    this.socket.emit("AgentConnect", data);
    this.socket.on("AddClient", this.NewClientEvent);
    this.socket.on("new_message", this.NewMessageEvent);
    this.socket.on("Finish_chat", this.FinishChat);
    this.socket.on("ClientData", this.SetClientData);
    this.socket.on("disconnect", function () {
      window.location.reload();
    });
    this.socket.on("auth", function () {
      window.location.reload();
    });
  };
}

const agentSocket = new Agent();
