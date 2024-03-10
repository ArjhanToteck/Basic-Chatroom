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
				socket.emit("test", "asdasd");
				socket.on("test", message => {
					console.log("test", message);
					socket.emit("test", message);
				});
			});
	}

	res.end();
};



export default startNamespace;