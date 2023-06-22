const { info } = require('console')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server,{cors:{origin: "*" }})
const mongoose = require("mongoose")


const DB = "mongodb+srv://hutum:_~z4FiRp_nTg6-4@cluster0.4bdzw.mongodb.net/fish?retryWrites=true&w=majority"
mongoose.connect(DB, function(err, db){console.log('database connected'); 
let info = db.collection('fish-users');
let mess = db.collection('users-message');



app.set('view engine', 'ejs')

app.get('/home', (req , res) => {
  res.render('home')
})

server.listen(3001, ()=> {
  console.log("server running...")
})

io.on('connection', (socket)=>{
  console.log("User connected:" + socket.id)

  socket.on('message', (data)=>{
    console.log(data);
    socket.broadcast.emit('message', data.message);
    
    let message = data.message;
    if(message){
    mess.insert({message: message});
    }
  })
  mess.find().sort({_id: -1}).toArray(function(err, res){
    socket.emit('output', res);
});

  socket.on('register', (data)=>{
    let email = data.email;
    let name = data.name;
    let phone = data.phone;

    let tp = data.tp;
    let dl = data.dl;
    let a = data.a;
    let b = data.b;
    let c = data.c;

    let today = data.today;
    let h = data.h;
    let m = data.m;

    if(email && name && phone && dl>0){
    info.insert({date: today, houre:h, minute:m,
      address:email, 
                    name: name, 
                    phone:phone, 
                    product:tp, 
                    delivery:dl, 
                    mini_burger: a, regular_burger: b, fuchka: c});
    }

  })

})
});
