export default class Message {
	constructor(sender, content, date) {
		Object.assign(this, { sender, content, date });
	}
}