const express = require('express');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const MailComposer = require("nodemailer/lib/mail-composer");
const nodemailer = require('nodemailer')
const path = require('path')
require('dotenv').config()

// Schema model

const CryptoJS = require('crypto-js')

const {User_reg_Model} = require('../model/forRegistration')

const bcrypt = require('bcryptjs');
const { activity } = require('./activity');
const { userMsg } = require('../model/usermsg');
const { User_details_Model } = require('../model/userDetails');

// const { publicDecrypt } = require('crypto');

// Register User Details

async function regUser(req, res){

    try{
        console.log("Insidde...");
        var data = CryptoJS.AES.decrypt(req.body.hashed,'secret');
        var decryptedData = JSON.parse(data.toString(CryptoJS.enc.Utf8))

        let emailExist =await User_reg_Model.findOne({email:decryptedData.email})
        if(emailExist){
            let resp ={response:"Email Already exist",status:false}
            return res.send(resp)
        }

    // Password Hash

        let hash = await bcrypt.hash(decryptedData.password,10)
        
        const user = await User_reg_Model.create({
        email:decryptedData.email,
        password:hash,
        name:decryptedData.name,
        role:decryptedData.role,
        mobileno:decryptedData.mobileno,
        marital:decryptedData.marital
    });

    let rev =decryptedData.email
    let sender = nodemailer.createTransport({
        host:'smtp.zeptomail.com',
        port: 587 ,
        secure:false,
        auth:{
            user:process.env.auth_admin_user,
            pass:process.env.pass_admin
        }
    })
    let composemail={
        from:process.env.auth_admin_user,
        to:rev,
        subject:"node js Test mail",
        text:'Registered...!'
    }
    await sender.sendMail(composemail,function(error,info){
        if(error){
            console.log("error : ",error);
        }
        else{
            console.log("info response : ",info.response);
        }
    })

// save activities in db--->

    let idforact = user._id;
    let emailforact = user.email;
    let act = "Registration Success...";
    let resu = await activity(act , idforact ,emailforact)
    var encryptedres = CryptoJS.AES.encrypt(JSON.stringify(resu),'secret').toString()
    var resobj = {
        response:"Registration success !",
        res:encryptedres,
        status:true
    }

    console.log(resobj);
    res.send(resobj)
    
}catch(err){
    console.error("----> ",err)
    res.status(400).json(err);
}
}

// login

async function loginUser(req, res){
    try{
        
        var data = req.body.email

        let emailExist =await User_reg_Model.findOne({email:data});
        if(!emailExist){
            console.log("email not exist ...");
            res.send("email not exist");
        }
        else{
        let userToken = await jwt.sign({email:emailExist.email},'firstToken');

        let idforact = emailExist._id;
        let act ="Login Success..."
        // let resu = await activity(act , idforact)
        let response ={
            resu:"Login Success...",
            usertoken:userToken,
            status:true
        }
        res.send(response);
    }
    }catch(err){
        console.log(err);
        res.status(400).json(err);
    }
}


async function saveMsg(req, res){
    try{
        const user = await userMsg.create({
        message:req.body.message,
        sender:req.body.user,
        receiver:req.body.receiver,
    });
    console.log("njxsj",user);
    res.send(user)
    }catch(err){
        console.error("----> ",err)
        res.status(400).json(err);
    }
}

async function saveUser(us,id){

    try{
        console.log("us,id",us,id)
        const use = await User_details_Model.findOne({user:us})

        if(use){
            const ue = await User_details_Model.findOneAndUpdate({user:us},{id:id})
        }
        else{
            await User_details_Model.create({
                user:us,
                id:id,
            })
        }
        
    }
    catch(err){
        console.log("err-->",err);
    }
}

// find User---->

async function findUser(user){
    try{
        const us = await User_details_Model.findOne({user:user})
        response = {
            user:us.user,
            id:us.id,
        }
        return response;
    }
    catch(err){
        console.log(err);
    }
}
module.exports={regUser, loginUser, saveMsg, saveUser, findUser}