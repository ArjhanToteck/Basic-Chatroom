"use client";

import { useEffect } from "react";
import io from "socket.io-client";

export default function page() {
	useEffect(() => {
		// make sure to enable socketioServer and namespace
		fetch("/api/basicChatroom")
			.finally(() => {
				// connect to namespace
				const socket = io("/basicChatroom");

				socket.on("connect", () => {
					console.log("connected");
					socket.emit("test", "something");
				});

				socket.on("test", data => {
					console.log("test", data);
				});
			});
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