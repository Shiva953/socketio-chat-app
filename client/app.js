var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var audio = new Audio('ting.mp3');
var doom = new Audio('doom.mp3')

form.addEventListener('submit', function(e) {
e.preventDefault();
if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
}
});

socket.on('connect', function() {
    // Send the user's nickname to the server when they connect
    socket.emit('nick', nickname);
  });

// socket.on('chat message', function(msg) {
// var item = document.createElement('li')
// item.textContent = msg;
// messages.appendChild(item);
// window.scrollTo(0, document.body.scrollHeight);
// audio.play();
// });

socket.on('chat message', function(msg) {
  let item = document.createElement('li');
  let item2 = document.createElement('li')
  if(!msg.startsWith('<')){
    item.textContent = msg;
  }
  else{
  var msgSpan = document.createElement('span');
  var timeSpan = document.createElement('span');
  var userSpan = document.createElement('span');

  // Extract the user, message, and time from the data object
  const user = msg.slice(0, msg.indexOf('>')+1);
  const message = msg.slice(msg.indexOf('>') + 1, msg.lastIndexOf(' '));
  const time = msg.slice(msg.lastIndexOf(' ') + 1);

  
  // Set the text content and styles for the message and time spans
  msgSpan.textContent = message;
  msgSpan.classList.add('message');
  if(message=="doom"){
    doom.play()
  }

  timeSpan.textContent = time;
  timeSpan.classList.add('time');

  // Set the text content and styles for the user span
  userSpan.textContent = user + '';
  userSpan.classList.add('user');

  // Add the message, time, and user spans to the list item
  item.appendChild(userSpan);
  item.appendChild(msgSpan);
  item.appendChild(timeSpan);
  }
  // Add the list item to the messages list
  messages.appendChild(item);

  // Scroll to the bottom of the messages list
  window.scrollTo(0, document.body.scrollHeight);

  // Play the ting sound
  audio.play();
});

