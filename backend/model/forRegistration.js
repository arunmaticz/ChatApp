const mongoose = require('mongoose')

const user_Registration = new mongoose.Schema({
    room:{
        type:Array,
    },
    name:{
        type:String
    },
    email:{
        type:String
    },
    mobileno:{
        type:Number
    },
    password:{
        type:String
    }
},{timestamps:true}) 

const User_reg_Model = mongoose.model("userRegs", user_Registration);

module.exports = {User_reg_Model}

