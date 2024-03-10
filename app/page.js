"use client";

import React, { useState } from 'react';
import { useEffect } from "react";
import io from "socket.io-client";

export default function page() {
	let socket;
	const [messages, setMessages] = useState([]);

	function handleMessage(message) {
		messages.push(re)
		const messageComponent = <Message message={message} />;
		const chat = document.getElementById("chat");

		ReactDOM.render(messageComponent, chat);
	}

	useEffect(() => {
		// make sure to enable socketioServer and namespace
		fetch("/api/basicChatroom")
			.finally(() => {
				// connect to namespace
				socket = io("/basicChatroom");

				// listen for connection
				socket.on("connect", () => {
					console.log("connected");
				});

				// listen for messages
				socket.on("message", (data) => {
					setMessages((previousMessages) => [...previousMessages, data]);
				});
			});
	}, []);

	return (
		<main>
			<h1 className="glitch" id="heading" data-text="Chatroom">Chatroom</h1>
			<div id="chat">
				{messages.map((message, index) => (
					<Message key={index} message={message} />
				))}
			</div>
			<br></br>
			<div id="chatInput">
				<input size="35" autocomplete="off" placeholder="Message" autofocus id="messageBox"></input>
				<button onclick={() => sendMessage()}>Send</button>
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