const mongoose = require('mongoose')

const user_details = new mongoose.Schema({
    user:{
        type:String,
    },
    id:{
        type:String
    }
},{timestamps:true}) 

const User_details_Model = mongoose.model("Loggedusers", user_details);

module.exports = {User_details_Model}
