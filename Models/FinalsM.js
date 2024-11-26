const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FinalsSchema = Schema({
    Names: String,
    Description:String,
    Description1:String,
    Code:String,
    status: Boolean,
    Categories: String,
    TypeFinal:Number,
    
});

module.exports = mongoose.model("Finals",FinalsSchema);