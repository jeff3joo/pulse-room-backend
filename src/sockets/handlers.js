const { getTime } = require("../utils/time");
const {
	addUser,
	removeUser,
	getUsers,
	removeUserFromAllRooms,
    getRoomList,
} = require("../utils/roomStore");

function sendSystemMessage(io, room, message) {
	io.to(room).emit("receive_message", {
		username: "System",
		message,
		time: getTime(),
	});
}

function handleJoinRoom(io, socket, { username, room }) {
	socket.join(room);
	addUser(room, { id: socket.id, username });

	io.to(room).emit("room_users", getUsers(room));
	sendSystemMessage(io, room, `${username} joined`);
}

function handleTyping(socket, { username, room }) {
	socket.to(room).emit("user_typing", { username });
}

function handleStopTyping(socket, { room }) {
	socket.to(room).emit("user_stop_typing");
}

function handleSendMessage(io, { room, username, message }) {
	io.to(room).emit("receive_message", {
		username,
		message,
		time: getTime(),
	});
}

function handleLeaveRoom(io, socket, { username, room }) {
	socket.leave(room);
	removeUser(room, socket.id);

	io.to(room).emit("room_users", getUsers(room));
	sendSystemMessage(io, room, `${username} left`);
}

function handleDisconnect(io, socket) {
	const removedUsers = removeUserFromAllRooms(socket.id);

	removedUsers.forEach(({ room, username }) => {
		socket.to(room).emit("room_users", getUsers(room));
		sendSystemMessage(io, room, `${username} left`);
	});
}

function handleGetRooms(io, socket) {
	const roomList = getRoomList();

	socket.emit("rooms_list", roomList);
}

function registerSocketHandlers(io) {
	io.on("connection", (socket) => {
		socket.on("join_room", (payload) => handleJoinRoom(io, socket, payload));
		socket.on("typing", (payload) => handleTyping(socket, payload));
		socket.on("stop_typing", (payload) => handleStopTyping(socket, payload));
		socket.on("send_message", (payload) => handleSendMessage(io, payload));
		socket.on("leave_room", (payload) => handleLeaveRoom(io, socket, payload));
		socket.on("disconnect", () => handleDisconnect(io, socket));
		socket.on("get_rooms", () => handleGetRooms(io, socket));
	});
}

module.exports = { registerSocketHandlers };
