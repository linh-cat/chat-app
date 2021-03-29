// get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// DOM
const chatFormElement = document.getElementById("chat-form");
const RoomNameElement = document.getElementById("room-name");
const userLists = document.getElementById("users");

// Join chat room
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
});

chatFormElement.addEventListener("submit", (e) => {
  e.preventDefault();

  // get value form  message
  const msg = e.target.elements.msg.value;

  // Emit chat message
  socket.emit("chatMessage", msg);

  e.target.elements.msg.value = "";
});

// Output message to DOm
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <div class="message">
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>
    </div>
    `;

  document.querySelector(".chat-messages").appendChild(div);
}

// Add Room Name
function outputRoomName(room) {
  RoomNameElement.innerText = room;
}

// Add user
function outputUsers(users) {
  userLists.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userLists.appendChild(li);
  });
}

//Prompt the user before leave chat room
// document.getElementById("leave-btn").addEventListener("click", () => {
//   const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
//   if (leaveRoom) {
//     window.location = "../index.html";
//   } else {
//   }
// });
