const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TipificationSchema = Schema({
    Names: String,
    Description:String,
    status: Boolean,
    Finals: [
      {
        FinalsId: {
          type: Schema.Types.ObjectId,
          ref: "Finals",
          required: true,
        },
      }
    ],
    Categories: String


});

module.exports = mongoose.model("Tipifications",TipificationSchema);