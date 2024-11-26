/**
 * name:UserC
 * description: controller for module of Users.
 * Author: Cristian Camilo Castrillon.
 * Date: 2020-11-06
 */

const { Schema } = require("mongoose");
const CustomerM = require("../Models/CustomerM");
const RoomsM = require("../Models/RoomsM");
const QueueM = require("../Models/queueM");
const ViewDataPage = require("../common/PageData");
const session = require("express-session");
const queueM = require("../Models/queueM");
const UserM = require("../Models/UserM");
const _date = require("../common/Date");
const logger = require("../common/Utilities/Logger");
const Date = require("../common/Date");

module.exports.PostregisterSumaMovil = (req, res, next) => {
  const Name = req.query.Name;
  const phone = req.query.Phone;
  const Email = req.query.Email;

  console.log(req.query.Phone);
  const customer = new CustomerM({
    Name: Name,
    Phone: phone,
    email: Email,
    CreatedAt: _date.get(),
  });
  customer.save().then((result) => {
    if (result != null) {
      // save the Customer Information
      req.session.CustomerId = result.id;
      console.log(result);
      req.session.Name = Name;
      req.session.status = "queue";

      // INSERT NEW ROOM
      const _users = {
        CustomerId: result._id,
        typeId: 1,
      };
      const Room = new RoomsM({
        CreatedAt: _date.get(),
        CreatedBy: Name,
        TypeCreatedBy: 1,
        Status: 0,
        Users: [_users],
      });

      Room.save().then((RoomResult) => {
        const Queue = new queueM({
          CustomerId: result.id,
          RoomId: RoomResult.id,
          CustomerName: Name,
          createdAt: _date.get(),
          status: 0, // - not attended
          Type: 1, // 1 Normal Attencion
        });
        req.session.Room = RoomResult.id;
        Queue.save().then((QueueResult) => {
          req.session.queueId = QueueResult.id;
          res.redirect("/Customer/Home");
        });
      });
    } else {
      res.redirect("/Customer/Register");
    }
  });
};

exports.CustomerRegister = (req, res) => {
  res.render("CHAT/register");
};

module.exports.Home = (req, res, next) => {
  let view = "CHAT/client";

  const CustomerId = req.session.CustomerId;
  const Room = req.session.Room;
  const Name = req.session.Name;
  const status = req.session.status;

  ViewDataPage.pageTitle = "Home";
  if (!CustomerId) {
    res.redirect("end");
  }
  ViewDataPage.RoomId = Room;
  ViewDataPage.QueueId = req.session.queueId;
  ViewDataPage.layout = 'Customer/main';
  ViewDataPage.status = Room.Status;
  logger.info("new client connection");
  if (CustomerId) {
    RoomsM.findById(Room)
      .populate("Users.CustomerId")
      .then((room) => {
        const customerRoomData = room.Users.filter(
          (user) => user.CustomerId.Name
        )[0];

        if (!customerRoomData) {
          res.redirect("register");
        }



        ViewDataPage.Customer = customerRoomData.CustomerId;
        ViewDataPage.status = room.Status;
        ViewDataPage.Chats = JSON.stringify(room.conversation);
        logger.select(customerRoomData);
        res.render(view, ViewDataPage);
      });
  } else {
    res.render(view, ViewDataPage);
  }

  // GET THE CUSTOMER
};

module.exports.End = (req, res, next) => {
  let view = "CHAT/EndChat";
  ViewDataPage.layout = 'Customer/main';
  res.render(view, ViewDataPage);
};
