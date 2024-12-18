"use client";

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

export default function Page() {
	const [messages, setMessages] = useState([]);
	const [scrolledToBottom, setScrolledToBottom] = useState(true);
	const socket = useRef(null);

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
		window.onscroll = () => {
			setScrolledToBottom((window.innerHeight + window.scrollY) >= document.body.offsetHeight);
		};

		// make sure to enable socketioServer and namespace
		fetch(process.env.NEXT_PUBLIC_SOCKETIO_SERVER + "/api/basicChatroom")
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
			console.log(scrolledToBottom);
			window.scrollTo(0, document.body.scrollHeight);
		}
	}, [messages]);

	return (
		<main>
			<div style={{ position: "fixed", width: "100%", zIndex: 1 }}>
				<header className="red">
					<h1>Basic Chatroom</h1>
				</header>
				<div className="divider topDivider"></div>
			</div>
			<section>
				<content>
					<div id="chat" style={{ paddingBottom: "50px", paddingTop: "250px" }}>
						{messages.map((message, index) => (
							<div key={index}>
								<Message message={message} />
								<br></br>
							</div>
						))}
					</div>
				</content>
				<div
					id="chatInput"
					style={{
						width: "85%",
						display: "flex",
						bottom: "10px",
						position: "fixed",
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
		</main >
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