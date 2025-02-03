"use client";

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

export default function Page() {
	const [messages, setMessages] = useState([]);
	const [scrolledToBottom, setScrolledToBottom] = useState(true);
	const socket = useRef(null);
	const chat = useRef(null);

	function sendMessage() {
		const messageBox = document.getElementById("messageBox");
		socket.current.emit("message", messageBox.value);
		messageBox.value = "";
	}

	function handleKeyDown(event) {
		if (event.key === "Enter") {
			sendMessage();
		}
	}

	useEffect(() => {
		// checks if scrolled to bottom
		const chatElement = chat.current;

		window.onscroll = () => {
			const isScrolledToBottom = chatElement.scrollHeight - chatElement.clientHeight <= chatElement.scrollTop + 1;
			setScrolledToBottom(isScrolledToBottom);
		};

		// make sure to enable socketioServer and namespace
		fetch(process.env.NEXT_PUBLIC_SOCKETIO_SERVER + "/api/projects/basicChatroom")
			.finally(() => {
				// connect to namespace
				socket.current = io(process.env.NEXT_PUBLIC_SOCKETIO_SERVER + "/basicChatroom");

				// listen for messages
				socket.current.on("messages", (data) => {
					// set messages
					setMessages((previousMessages) => [...previousMessages, ...data]);
				});
			});
	}, []);

	useEffect(() => {
		// autoscroll
		if (scrolledToBottom) {
			chat.current.scrollTo(0, chat.current.scrollHeight);
		}
	}, [scrolledToBottom]);

	return (
		<main>
			<section style={{ height: "100%" }}>
				<div id="chat" ref={chat} style={{
					wordBreak: "break-word",
					width: "100%",
					height: "500px",
					overflowY: "scroll"
				}}>
					{messages.map((message, index) => (
						<div key={index}>
							<Message message={message} />
							<br></br>
						</div>
					))}
				</div>
				<br></br>
				<div
					id="chatInput"
					style={{
						width: "80%",
						display: "flex",
						position: "absolute",
						bottom: "1%"
					}}>
					<input
						autoComplete="off"
						placeholder="Message"
						autoFocus
						onKeyDown={handleKeyDown}
						id="messageBox"
						style={{ flex: 1 }}>
					</input>
					<button onClick={sendMessage} style={{ marginLeft: "5px" }}>Send</button>
				</div>
			</section>
		</main>
	);
}

function Message({ message }) {
	let { sender, content, date } = message || {};

	date = new Date(date);

	return (
		<div style={{ textAlign: "center" }}>
			<strong style={{ color: "red" }}>
				{sender} ({date.toLocaleDateString()}, {date.toLocaleTimeString()})
			</strong>
			<br></br>
			<span>{content}</span>
		</div>
	);
}