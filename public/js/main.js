//jshint esversion:6
const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
// var aud = new Audio('ting.mp3');
// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});


// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  // console.log(id);
  outputMessage(message);
  // aud.play();
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  // outputMessage(msg,'right');
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  if( message.username=="ChatCordBot"){
    const div = document.createElement('div'); 
    div.innerText = message.text;
    div.classList.add('joined');
    document.querySelector('.chat-messages').appendChild(div);
  }
  else{
      const div = document.createElement('div');
      // if(pos=="right")
      div.classList.add('message');
      // else div.classList.add('my');
      const p = document.createElement('p');
      p.classList.add('meta');
      p.innerText = message.username;
      p.innerHTML += `<span> ${message.time}</span>`;
      div.appendChild(p);
      const para = document.createElement('p');
      para.classList.add('text');
      para.innerText = message.text;
      div.appendChild(para);
      document.querySelector('.chat-messages').appendChild(div);
  }
  // aud.play();
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
