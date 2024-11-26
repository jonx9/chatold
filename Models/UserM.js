const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    Names: String,
    LastName:String,
    Login: {
        type: String,
        required: true
    },
    Password:{
        type: String,
        required: true
    },
    // campaignId:{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Campaign',
    //     required:true
    // },
    token:{
        type: String,
        required:false
    },
    tokenExpiration:{
        type: Date,
        required:false
    }
});

module.exports = mongoose.model("Users",UserSchema);