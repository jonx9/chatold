// const moment = require("moment");
const logger = require("./Utilities/Logger");
var moment = require("moment-timezone");
moment().tz("America/Bogota").format();
module.exports = {
  get: () => {
    return moment().utc(new Date(), "YYYY-MM-DD HH:mm:ss").toDate();
  },
  format: (date) => {
    return moment(date).utc().format("YYYY-MM-DD HH:mm:ss");
  },

  getPlusSeconds: (seconds) => {
    let t = moment().utc(new Date(), "YYYY-MM-DD HH:mm:ss").toDate();
    return moment(t).add(seconds, "seconds").toDate();
  },
  DateplusFiveHours: (date) => {
    return moment(date).add(5, "hours").format("YYYY-MM-DD HH:mm:ss");
  },
};

var ConvertDate = function (date) {
  const dateOne = moment(date).format("HH:mm:ss");
  const dateNow = moment(Date.now()).format("HH:mm:ss");

  var hourOne = dateOne.split(":"),
    hourTwo = dateNow.split(":"),
    t1 = new Date(),
    t2 = new Date();

  t1.setHours(hourOne[0], hourOne[1], hourOne[2]);
  t2.setHours(hourTwo[0], hourTwo[1], hourTwo[2]);

  //Aquí hago la resta
  t1.setHours(
    t1.getHours() - t2.getHours(),
    t1.getMinutes() - t2.getMinutes(),
    t1.getSeconds() - t2.getSeconds()
  );

  var response =
    "La diferencia es de: " +
    (t1.getHours()
      ? t1.getHours() + (t1.getHours() > 1 ? " horas" : " hora")
      : "") +
    (t1.getMinutes()
      ? ", " + t1.getMinutes() + (t1.getMinutes() > 1 ? " minutos" : " minuto")
      : "") +
    (t1.getSeconds()
      ? (t1.getHours() || t1.getMinutes() ? " y " : "") +
        t1.getSeconds() +
        (t1.getSeconds() > 1 ? " segundos" : " segundo")
      : "");

  return response;
};

module.exports.ConvertDate = ConvertDate;
