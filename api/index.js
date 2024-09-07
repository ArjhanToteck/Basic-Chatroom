import Message from "./Message";
import startSocketio, { io } from "/src/pages/api/socketio.js";
import startPocketbase, { pocketbase } from "/src/pages/api/pocketbase.js";

let namespace;

export default function startNamespace(req, res) {
	// wake up socketio server
	startSocketio(req, res);

	// start namespace
	if (!namespace) {
		console.log("starting basicChatroom namespace");

		namespace = io.of("/basicChatroom");

		namespace.on("connection", async (socket) => {
			// wake up pocketbase
			startPocketbase(req, res);

			// get chat history
			const messages = await pocketbase.collection("basicChatroom").getFullList({
				sort: "-date",
			});

			// send chat history to user
			socket.emit("messages", messages.reverse());

			// listen for messages
			socket.on("message", async (content) => {
				// create message object
				const message = new Message("Anonymous", content, new Date());

				// broadcast message to all of namespace
				namespace.emit("messages", [message]);

				// add message to database
				await pocketbase.collection("basicChatroom").create(message);
			});
		});
	}

	res.end();
};