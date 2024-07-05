
const mongoose = require("mongoose");

const bcrypt = require('bcryptjs');


const toUpdateData =async (userData, email, update_body)=>{
    try {
        // if(!mongoose.Types.ObjectId.isValid(id)){
        // return ("error : Task Not Found")
        // }
        const users = await userData.findOneAndUpdate({email: email},{room:update_body})
        return users;
    } catch (error) {
        return error
    }
}

module.exports = {toUpdateData}