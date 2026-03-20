"use client";

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

export default function Page() {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);
	const scrolledToBottom = useRef(true);
	const socket = useRef(null);
	const chatElement = useRef(null);

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
		const currentChat = chatElement.current;

		// checks if scrolled to bottom on scroll
		currentChat.onscroll = () => {
			const currentScroll = currentChat.scrollHeight - currentChat.clientHeight <= currentChat.scrollTop + 1;
			scrolledToBottom.current = currentScroll;
		};

		// make sure to enable socketioServer and namespace
		fetch(process.env.NEXT_PUBLIC_SOCKETIO_SERVER + "/api/projects/basicChatroom")
			.finally(() => {
				// connect to namespace
				socket.current = io(process.env.NEXT_PUBLIC_SOCKETIO_SERVER + "/basicChatroom");

				// make sure listen event isn't already subscribed to
				if (!socket.listeningForMessage) {
					// listen for messages
					socket.current.on("messages", (data) => {
						setLoading(false);

						// set messages
						setMessages((previousMessages) => [...previousMessages, ...data]);
					});
				}

				socket.listeningForMessage = true;
			});
	}, []);

	useEffect(() => {
		// autoscroll
		if (scrolledToBottom.current) {
			chatElement.current.scrollTop = chatElement.current.scrollHeight;
		}
	}, [scrolledToBottom.current, messages]);

	return (
		<main>
			<section style={{ height: "100%" }}>
				<div id="chat" ref={chatElement} style={{
					wordBreak: "break-word",
					position: "fixed",
					width: "100%",
					top: "100px",
					bottom: "150px",
					overflowY: "scroll"
				}}>
					<p style={{ display: loading ? "block" : "none" }}>Loading...</p>

					{messages.map((message, index) => (
						<div key={index}>
							<Message message={message} />
							<br />
						</div>
					))}
					<br />
				</div>

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