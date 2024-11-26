// CREATE NEW USER.
const { Schema } = require("mongoose");
const logger = require("../../common/Utilities/Logger");
const finalsM = require('../../Models/FinalsM');
const TipificationsM = require('../../Models/TipificaciontsM');

class TipificationDAL {
  GetAllTipifications = async () => {
    logger.info('data')
    return await TipificationsM.find({ status: true }).populate("Finals.FinalsId");
  }
}

module.exports = TipificationDAL

// LIST USERS.
// EDIT USERS.