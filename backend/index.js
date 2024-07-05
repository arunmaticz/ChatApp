// Libraray
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const { addUser, removeUser, getUser, getRoomUsers, getId } = require("./entity");

// Instances
const app = express()
const server = http.createServer(app);
const io = socketio(server,{cors: { origin: '*' }})

// End point
app.get('/',(req,res) => {
  res.json("Api is working");
})

// ---------->

const cors = require('cors')
const mongoose = require('mongoose')

const mongooseRoute = require('./routes/routes')

const bodyParser=require('body-parser');
const { findUser } = require("./controller/registraion");
app.use(bodyParser.urlencoded({ extended: false }));
const urlencodedparser = bodyParser.urlencoded({ extended: false });

// --->

app.use(cors())

app.use(express.json())

app.use('/', urlencodedparser ,mongooseRoute)

// Socket

let loggedusers = [];

io.on('connect',(socket) => {

  socket.on('join',({user,room},callback) => {
    console.log(user,room)
      const {response , error} = addUser({id: socket.id , user:user, room: room})
    // ---
      const rs= {id: socket.id , user:user, room: room}
      
      console.log("ii",rs);
      loggedusers.push(rs)

    // ---
      console.log(response)

      if(error) {
        callback(error)
        return;
      }
      socket.join(response.room);
      socket.emit('message', { user: 'admin' , text: `Welcome ${response.user} ` });
      socket.broadcast.to(response.room).emit('message', { user: 'admin', text : `${response.user} has joined` })

      io.to(response.room).emit('roomMembers', getRoomUsers(response.room))
  })

  socket.on('sendMessage',(message,callback) => {
    
      const user = getUser(socket.id)

      io.to(user.room).emit('message',{ user: user.user, text : message })

      callback()
  })

  socket.on('private_chat',async (message,callback) => {

      var from= message.sender
      let to = message.to
      let msg = message.message

      const user =await findUser(to)
      console.log("on prv_chat",from,to,msg,loggedusers,"use.id : ",user.id);
      try{
        io.to(user.id).emit('receiver1',{ from: from, text : msg })
      }catch(err){
        console.log("err",err)
      }
})

socket.on('disconnect',() => {
    console.log("User disconnected");
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message',{ user: 'admin', text : `${user.user} has left` })
    }
  })
})

mongoose.connect('mongodb://127.0.0.1:27017/myapp').then(()=>{
    console.log("database Connected..")
    server.listen(8000,() => console.log('Server started on 8000'))
}).catch((error) => console.log(error))
