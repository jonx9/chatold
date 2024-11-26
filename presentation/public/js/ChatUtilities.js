class ChatUtilities {
  constructor() {
    this.SocketUrl = window.location.origin;
  }

  SetNotification = () => {
    var tone = document.getElementById("notificationMessage");
    tone.pause();
    tone.currentTime = 0;
    tone.play();
  };

  GetMenustructure = (MenuData) => {
    console.log("nuevo menu", MenuData);
    return `
    
    <a
    class="inverted item ChatClientItem"
    data-roomid="${MenuData?.RoomId}"
    data-name="${MenuData?.Name || "Cliente"}"
      >
      ${MenuData?.Name || "Cliente"}
    <div class="ui teal left pointing label">0</div>
    </a>
    `;
  };

  GetMessageStructure = (data) => {
    let avatar = "nan.jpg";
    let posicion = "float rigth";
    //append the new message on the chatroom
    if (data.type == 1) {
      avatar = "tom.jpg";
      posicion = "float left";
    }
    let date = data.date ? data.date : new Date().getHours();
    let message = `
        <div class="comment ${posicion}">
          <a class="avatar">
              <img src="/images/demo/avatar/${avatar}">
          </a>
        <div class="content">
            <a class="author">${data.username}</a>
            <div class="metadata">
                <div class="date">${date}</div>
            </div>
            <div class="text">
                ${data.message}
            </div>
            <div class="actions">
                <a class="reply">Responder</a>
            </div>
        </div>
    </div>
                      `;

    return message;
  };

  fillMessage = () => {
    this.ClearWindows();
    this.currentMessages.forEach((val, ind) => {
      let data = {
        type: val.Sender,
        date: val.sent,
        message: val.body,
        username: val.from,
      };

      this.Doom.Form.chatroom.append(this.GetMessageStructure(data));
    });

    this.keepTheChatRoomToTheBottom();
  };

  AddMessageToDataStorage = (data, RoomId) => {
    const index = this.Chats.findIndex((chat) => {
      return chat.RoomId._id == RoomId;
    });

    if (index != -1) {
      this.Chats.filter((chat) => {
        return chat.RoomId._id == RoomId;
      })[0].RoomId.conversation.push(data);
    }
  };

  RemoveDataStore = (RoomId) => {
    this.Chats = this.Chats.filter((chat) => {
      return chat.RoomId._id != RoomId;
    });
  };

  AddDataStore = (c) => {
    this.Chats.push(c);
  };

  ClearWindows = () => {
    this.Doom.Form.chatroom.html("");
  };

  // function thats keeps the chatbox stick to the bottom
  keepTheChatRoomToTheBottom = () => {
    const chatroom = document.getElementById("chatroom");
    chatroom.scrollTop = chatroom.scrollHeight - chatroom.clientHeight;
  };
}
