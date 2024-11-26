var formatDate = (date) => {
  return moment(date).format("hh:mm a MMM DD YYYY");
};
var ConvertDate = (date) => {
  const dateOne = moment(date).add(5, "hours").format("HH:mm:ss");
  const dateNow = moment(Date.now()).format("HH:mm:ss");

  var hourOne = dateOne.split(":"),
    hourTwo = dateNow.split(":"),
    t1 = new Date(),
    t2 = new Date();

  t1.setHours(hourTwo[0], hourTwo[1], hourTwo[2]);
  t2.setHours(hourOne[0], hourOne[1], hourOne[2]);

  //Aquí hago la resta
  t1.setHours(
    t1.getHours() - t2.getHours(),
    t1.getMinutes() - t2.getMinutes(),
    t1.getSeconds() - t2.getSeconds()
  );

  var response =
    (t1.getHours()
      ? t1.getHours() + (t1.getHours() > 1 ? " horas" : " hora")
      : "") +
    (t1.getMinutes()
      ? " " + t1.getMinutes() + (t1.getMinutes() > 1 ? " minutos" : " minuto")
      : "") +
    (t1.getSeconds()
      ? (t1.getHours() || t1.getMinutes() ? " y " : "") +
        t1.getSeconds() +
        (t1.getSeconds() > 1 ? " segundos" : " segundo")
      : "");

  return response;
};
