const rooms = {};

function addUser(room, user) {
	if (!rooms[room]) {
		rooms[room] = [];
    }

    const exists = rooms[room].some((item) => item.id === user.id);
    if (exists) return;
	rooms[room].push(user);
}

function removeUser(room, socketId) {
	if (!rooms[room]) return;
	rooms[room] = rooms[room].filter((user) => user.id !== socketId);
	if (rooms[room].length === 0) {
		delete rooms[room];
	}
}

function getUsers(room) {
	return rooms[room] ? [...rooms[room]] : [];
}

function getUserBySocketId(socketId) {
	for (const room in rooms) {
		const user = rooms[room].find((item) => item.id === socketId);
		if (user) {
			return { ...user, room };
		}
	}
	return null;
}

function removeUserFromAllRooms(socketId) {
	const removed = [];

	for (const room in rooms) {
		const user = rooms[room].find((item) => item.id === socketId);
		if (user) {
			removed.push({ room, username: user.username });
			removeUser(room, socketId);
		}
	}

	return removed;
}

function getRoomList() {
	return Object.keys(rooms).map((room) => ({
		id: room,
		name: room,
		count: rooms[room].length,
	}));
}

module.exports = {
	addUser,
	removeUser,
	getUsers,
	getUserBySocketId,
	removeUserFromAllRooms,
    getRoomList,
};
