const Message = require("./Message");
import startServer, { io } from "/pages/api/socketio.js";

let namespace;

const startNamespace = (req, res) => {
	// start socketio server if needed
	startServer(req, res);

	// start namespace
	if (!namespace) {
		console.log("starting basicChatroom namespace");

		namespace = io.of("/basicChatroom")
			.on("connection", socket => {
				socket.emit("message", new Message("Server", "Hello world", new Date()));
			});
	}

	res.end();
};

export default startNamespace;