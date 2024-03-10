/*const http = require("http");
const WebSocketServer = require("websocket").server;
const Database = require("@replit/database");

const ChatMessage = require("./ChatMessage.js");

const client = "arjhantoteck.vercel.app";

// opens database
const database = new Database();

// keeps track of open connections
let connections = [];

// opens http server
let server = http.createServer(function (req, res) {
	const headers = {
		"Access-Control-Allow-Origin": "*",
		"Content-Type": "text/plain",
	};

	res.writeHead(200, headers);
	res.end("Placeholder, lmao");
});
server.listen(8443);
console.log("Server running on port 8443");

// opens websocket server
wsServer = new WebSocketServer({
	httpServer: server,
	autoAcceptConnections: false,
});

wsServer.on("request", function (request) {
	// accept connection
	let connection = request.accept(null, request.origin);
	connections.push(connection);

	// sends chat history to connection
	database.get("chat").then((data) => {
		let currentChat = data;

		if (!currentChat) {
			currentChat = [];
		}

		connection.sendUTF(JSON.stringify(currentChat));
	});

	// listens for connection to game
	connection.on("message", function (data) {
		const socketMessage = JSON.parse(data.utf8Data);

		// ignore bad message
		if (!socketMessage.message) {
			return;
		}

		// create message object
		message = new ChatMessage(
			"Anonymous",
			socketMessage.message,
			new Date()
		);

		console.log(message);

		// gets current chat from database
		database.get("chat").then((data) => {
			let currentChat = data;

			if (!currentChat) {
				currentChat = [];
			}

			// modifies chat to add message
			currentChat.push(message);

			// sets chat to modified version
			database.set("chat", currentChat);
		});

		// pushes message out to all connections
		for (let i = 0; i < connections.length; i++) {
			connections[i].sendUTF(JSON.stringify([message]));
		}
	});

	// prepares for connection to close
	connection.on("close", function () {
		// removes connection from chat room
		connections = connections.splice(connections.indexOf(connection), 1);
	});
});*/