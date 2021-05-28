const express = require('express')
const app = express()
const http = require('http').createServer(app)

let users=[]; // STORED THE NEW USERS JOINED IN THE CHAT ROOM

const PORT = process.env.PORT || 5700


http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {

//send back again to client side bago join
socket.on("bago join",(data)=>{
    users.push(data)//ALL THE USERNAME OF USERS will be in stored in array.
    io.emit("numberofusers",users) // SEND TO CLIENT THE USERNAMES IN FORM OF Array.
    io.emit("bago join",data) //SEND TO CLIENT THE BAGO JOIN which function is to update the participant when new users in.
     console.log(users)
})



//send back again to client side user typing

socket.on("usertyping",(data)=>{
    io.emit("usertyping",data)
})

// USER IS DISCONNECTING..
socket.on("disconnect",()=>{
    var i = users.indexOf(socket);
    users.splice(i, 1);
    io.emit("numberofusers",users) // SEND TO CLIENT THE UPDATED LIST OF USERS with decremented by 1 whenever user disconnect.
})

//send back again to client side user is stop typing

socket.on("userstoptyping",(data)=>{
 
    io.emit("userstoptyping",data)
})


//send back again to client side user is leaving
// this function display the name of user whos leaving.
socket.on("leaving",(data)=>{
    io.emit("leaving",data)
})

    console.log('Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })



})