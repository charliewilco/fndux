import { wrap } from "comlink";
import { Suspense, useId, useRef, useState, useSyncExternalStore } from "react";

import SharedCounterWorker from "./worker?sharedworker";

function subscribeWorker(worker: SharedWorker) {
	const listeners = new Set();
	let sharedData: any = {};

	function subscribe(listener: () => void) {
		const cb = async (event) => {
			sharedData = Object.assign({}, sharedData, event.data);
			console.log(Object.assign({}, event.data), event, "obj");
			listeners.add(listener);
		};

		worker.port.addEventListener("message", (event) => {
			sharedData = event.data;
			console.log(Object.assign({}, event.data), event, "obj");
			listeners.add(listener);
		});

		return function unsubscribe() {
			worker.port.removeEventListener("message", () => {});
			listeners.delete(listener);
		};
	}

	worker.port.start();

	function getSnapshot() {
		return sharedData;
	}

	function flush() {
		listeners.clear();
	}

	return {
		subscribe,
		getSnapshot,
		flush,
		workerInstace: worker,
	};
}

function useSyncWorker(
	worker: new (options?: {
		name?: string;
	}) => SharedWorker,
	name = "worker",
) {
	const id = useId();
	const ref = useRef(new worker({ name: `${name}-${id}` })).current;
	const { subscribe, getSnapshot, workerInstace } = useRef(
		subscribeWorker(ref),
	).current;

	const synced = useSyncExternalStore(subscribe, getSnapshot);

	return [synced, workerInstace] as const;
}

async function init() {
	const worker = new SharedCounterWorker();
	/**
	 * SharedWorkers communicate via the `postMessage` function in their `port` property.
	 * Therefore you must use the SharedWorker's `port` property when calling `Comlink.wrap`.
	 */
	const obj = wrap(worker.port);
	await obj.inc();
}

function PoolDemo() {
	const [state, workerInstace] = useSyncWorker(SharedCounterWorker, "counter");

	const obj = useRef(wrap(workerInstace.port)).current;

	return (
		<div className="Pool">
			{JSON.stringify({ state }, null, 2)}
			<h1 className="title">Pool</h1>
			<p>Coming soon...</p>
			<button type="button" onClick={() => obj.inc()}>
				Click
			</button>
		</div>
	);
}

export default function Wrapped() {
	return (
		<Suspense fallback="Loading...">
			<PoolDemo />
		</Suspense>
	);
}
