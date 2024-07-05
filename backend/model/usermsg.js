const mongoose = require('mongoose')

const user_Msg= new mongoose.Schema({
    message:{
        type:String,
    },
    sender:{
        type:String,
    },
    receiver:{
        type:String,
    }
},{timestamps:true}) 

const userMsg = mongoose.model("users_messages", user_Msg);

module.exports = {userMsg}

