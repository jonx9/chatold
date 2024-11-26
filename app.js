/**
 * GLOBALS VARS.
 */
const MONGODB_URI_PRODUCCION = "mongodb://usrBDChat:usrBDChat123@172.16.5.155:27017/BDCHAT";
const MONGODB_URI_DEVELOPER = "mongodb://UsrChatdeveloper:UsrChatdeveloper@172.16.5.155:27017/BDCHAT_DEVELOPER";

const MONGODB_URI = MONGODB_URI_DEVELOPER;

process.env.TZ = "America/Bogota";
/**
 * IMPORTS
 */
const path = require("path");
const cors = require('cors');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const csrf = require("csurf");
const app = express();
const queue = require("./common/QueueManagement");
var Handlebars = require("handlebars");
var exphbs = require("express-handlebars");
var _date = require('./common/Date');
const moment = require("moment");

// Import function exported by newly installed node modules.
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

/**
 * TEMPLATE ENGINE
 */
app.use(cors());

app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),

    helpers: {
      ToStringF: (value) => {
        return !value ? null : _date.format(value.toUTCString());
      },
      ifCond: function (v1, v2, options) {
        if (v1 === v2) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
      section: function (name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
      },
      ConvertDate: function (date1, date2) {

        const dateOne = moment(date1).add(5, "hours").format("HH:mm:ss");
        const dateTwo = moment(date2).add(5, "hours").format("HH:mm:ss");

        var hourOne = dateOne.split(":"),
          hourTwo = dateTwo.split(":"),
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

      }

    }
  })
);
app.set("views", path.join(__dirname, "/presentation/views"));
app.set("view engine", ".hbs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  next();
});

/**
 * MIDDELWARE
 */

app.use(bodyParser.urlencoded({ extended: false })); // x-www-form-urlencode form
// app.use(bodyParser.json()); // aplication-json
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
app.use(
  session({
    secret: "28Hksowu02892_sius228JAJi*_¡",
    resave: false,
    store: store,
    saveUninitialized: false,
  })
);
const csrfProtection = csrf();

// handlebars
console.log('__dirname' + (path.join(__dirname, "/presentation/public")));
app.use(express.static(path.join(__dirname, "/presentation/public")));

// app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  // res.locals.csrfToken = req.csrfToken();
  next();
});

//LIST OF ROUTES OF THE APPLICATIONS (Imports)
const AppRoutes = require("./routes/routes");
const logger = require("./common/Utilities/Logger");

app.use(AppRoutes);

const server = require('http').Server(app);
const socket = require('./socket')
const port = 8089;

const io = socket.connect(server);

/**
 * DATABASE CONNECTION
 */
try {
  mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  server.listen(port, () => {
      console.log("listen at port:" + port);
    });
} catch (error) {
  logger.error(error);
}

  // load consumer.js and pass it the socket.io object
var consumer = require("./Services/socket.js");
consumer.start(io);
queue.init(io);
