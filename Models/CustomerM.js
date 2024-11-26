const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CustomerM = Schema({
    Name:String,
    LastName:String,
    Phone:String,
    Phone1:String,
    Phone2:String,
    Phone3:String,
    email:String,
    document:String,
    typeDocument:String,
    age:Number,
    token:{
        type: String,
        required:false
    },
    tokenExpiration:{
        type: Date,
        required:false
    },
    CreatedAt:{
        type: Date,
        required:false
    },
    CreatedAt:{
        type: Date,
        required:false
    },
    TimeQueue:{
        type: Number,
        required:false
    },
    ChatAt:{
        type: Date,
        required:false
    }
    // campaignId:{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Campaign',
    //     required:true
    // },
})

module.exports = mongoose.model('Customers',CustomerM);