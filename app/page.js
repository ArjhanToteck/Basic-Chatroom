"use client"

import React, { useState, useEffect } from "react";

export default function BasicChatroom() {
	useEffect(() => {
		const server = "fa3b157f-1755-46f8-ae53-3f7655748664-00-7j0o8vn1p6mh.kirk.repl.co";
		let password;
		let gameCode;
		let connection;

		setUpConnection();

		function setUpConnection() {
			// establishes connection with websocket server
			connection = new WebSocket(`wss://${server}`);

			// waits until connection opened
			connection.addEventListener("open", function (event) {
				console.log("opened");
			});

			// recieve websocket messages
			connection.addEventListener("message", function (event) {
				const messages = JSON.parse(event.data);
				handleWebSocketMessage(messages);
			});
		}

		function sendMessage() {
			connection.send(JSON.stringify({
				message: messageBox.value
			}));
			messageBox.value = "";
		}

		// adds enter key event listener for sendMessage
		document.addEventListener('keydown', function (event) {
			if (event.key == "Enter") {
				sendMessage();
			}
		});

		function handleWebSocketMessage(messages) {
			// loops through every sent message
			for (let i = 0; i < messages.length; i++) {
				// parses date
				let date = new Date(messages[i].date);

				// create Message component
				let messageComponent = React.createElement(Message, {
					sender: messages[i].sender,
					date: date,
					message: messages[i].message,
				});

				// append messageComponent to chat
				ReactDOM.render(messageComponent, document.getElementById("chat"));
			}
		}


	}, []);

	return (
		<main>
			<h1 class="glitch" id="heading" data-text="Chatroom">Chatroom</h1>
			<div id="chat"></div>
			<div id="chatInput">
				<input size="35" autocomplete="off" placeholder="Message" autofocus id="messageBox"></input>
				<button onclick={() => sendMessage()}>Send</button>
			</div>
		</main>
	);
}

function Message({ sender, date, message }) {
	return (
		<div>
			<span className="invertedColors">
				{sender} ({date.toLocaleDateString()}, {date.toLocaleTimeString()})
			</span>
			<span>{message}</span>
		</div>
	);
}