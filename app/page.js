"use client";

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

export default function page() {
	const [messages, setMessages] = useState([]);
	const socket = useRef(null);

	function sendMessage() {
		const messageBox = document.getElementById("messageBox");
		socket.current.emit("message", messageBox.value);
		messageBox.value = "";
	}

	useEffect(() => {
		// make sure to enable socketioServer and namespace
		fetch(process.env.NEXT_PUBLIC_SOCKETIO_SERVER + "/api/basicChatroom")
			.finally(() => {
				// connect to namespace
				socket.current = io(process.env.NEXT_PUBLIC_SOCKETIO_SERVER + "/basicChatroom");

				// listen for messages
				socket.current.on("messages", (data) => {
					setMessages((previousMessages) => [...previousMessages, ...data]);
				});
			});
	}, []);

	return (
		<main>
			<h1 className="glitch" id="heading" data-text="Chatroom">Chatroom</h1>
			<div id="chat">
				{messages.map((message, index) => (
					<div>
						<Message key={index} message={message} />
						<br></br>
					</div>
				))}
			</div>
			<div id="chatInput">
				<input size="35" autocomplete="off" placeholder="Message" autofocus id="messageBox"></input>
				<button onClick={sendMessage}>Send</button>
			</div>
		</main>
	);
}

function Message({ message }) {
	let { sender, content, date } = message || {};

	date = new Date(date);

	return (
		<div>
			<span className="invertedColors">
				{sender} ({date.toLocaleDateString()}, {date.toLocaleTimeString()})
			</span>
			<br></br>
			<span>{content}</span>
		</div>
	);
}