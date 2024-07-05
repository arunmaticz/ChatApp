const express = require('express');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')

const {User_reg_Model} = require('../model/forRegistration');
const { toUpdateData } = require('./updateData');

// To Update Data to user1 finding by user id --PATCH
 
async function update(data){
    const email = data.email;
    const update_body = data;
    const users = await toUpdateData(User_reg_Model,email,update_body);
    return users;
}

module.exports={update}