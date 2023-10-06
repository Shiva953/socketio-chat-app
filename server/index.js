const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app); //creating a http server node and using express

//wrapping the http server to upgrade it to support websocket communication(which would listen for multiple users)
const { Server } = require("socket.io");
const io = new Server(server); //creating an io object of the socketio server class
app.use(express.static('../client')); //SERVING FRONTEND FROM SPECIFIED DIRECTORY
  
//HANDLING USERS
io.on('connection', (socket) => { //ESTABLISHING A CONNECTION
    console.log('user connected!')

      // Maintain a object of socket IDs to usernames
    let users = {}; //key(socket id) : value(nickname)

    // Assign a random nickname to the user when they connect
    let nickname = "Anonymous" + Math.floor(Math.random() * 10000);
    users[socket.id] = nickname; //assigning id for each user
    io.emit('chat message', `${nickname} joined!`);
    socket.on('nick', (nickname) => {
      users[socket.id] = nickname;
      io.emit('chat message', `${nickname} joined!`);
    
      // Emit a new event to update the nickname in the client-side
      io.to(socket.id).emit('update nickname', nickname);
    });
    socket.emit('chat message', 'Welcome! Type /help for help');  //default message to the new user when new connection is triggered(new user joins)

    socket.on('chat message', msg => { //when chat message event is triggered,it runs the function(broadcasts the require message to the server)
      const now = new Date();
      const time = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: false});

      if(msg==="/help")
      {
        socket.emit('chat message','type /nick <username> to set your username')
      }
      else if(msg.startsWith('/nick ')){
        // Update the user's nickname if they send a "/nick" message

        const newNickname = msg.slice(6).trim(); //setting new nickname
        if (newNickname) { //validating nickname
          if(newNickname.includes('<') || newNickname.includes('>')){
            socket.emit('chat message','Nickname should contain valid characters')
          }
          else{
          const oldNickname = users[socket.id];
          users[socket.id] = newNickname;
          io.emit('chat message', `${oldNickname} changed their nickname to ${newNickname}`);
          }
        } else {
          io.emit('chat message', 'Invalid nickname');
        }
      }
      else{
        io.emit('chat message', `<${users[socket.id]}>${msg} ${time}`);
      } //broadcasting user message
    });

    socket.on('disconnect', message=>{ // WHEN DISCONNECTION EVENT IS TRIGGERED,then it broadcasts this message(disconnection is a built-in event)
      console.log('User disconnected!')
      const nickname = users[socket.id];
      delete users[socket.id]; //removing left user from the users object
      io.emit('chat message', `${nickname} left the chat`);
    });
  });


const port = 3000
server.listen(port, () => {
  console.log(`listening on port ${port}`); //RUNNING THE SERVER AT GIVEN PORT
});