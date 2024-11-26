const router = require("express").Router();
const CustomerC = require("../../controller/CustomerController");
router.get("/register", CustomerC.PostregisterSumaMovil);
router.get("/home", CustomerC.Home);
router.get("/end", CustomerC.End);
//ruta paraa que el cliente se registre
// router.get('/Register',CustomerC.CustomerRegister);
module.exports = router;
