import { expose } from "comlink";

const obj = {
	data: {
		counter: 0,
	},
	inc() {
		this.data.counter++;
	},
};

/**
 * When a connection is made into this shared worker, expose `obj`
 * via the connection `port`.
 */

onconnect = (event) => {
	console.log("Shared worker created", event);
	const port: MessagePort = event.ports[0];

	port.addEventListener("message", (event) => {
		console.log(event, "message event");
		port.postMessage(obj.data);
	});

	expose(obj, port);

	port.start();
};
