import "./App.css";
import { CountStore, double, mutator } from "./Count";

function enableInterval(init = false) {
	let interval: number;
	if (init) {
		interval = setInterval(() => {
			const { increment } = CountStore.getBoundActions();

			increment();
		}, 3000);
	}

	return function stop() {
		if (interval) clearInterval(interval);
	};
}

function CounterActions() {
	const safeMutate = CountStore.useSafeMutate();
	const { increment, decrement, pi } = CountStore.useBound();

	return (
		<div className="buttons">
			<button type="button" onClick={increment}>
				Increment
			</button>
			<button type="button" onClick={decrement}>
				Decrement
			</button>
			<button type="button" onClick={pi}>
				&Pi;
			</button>
			<button type="button" onClick={() => safeMutate(mutator)}>
				Mutate
			</button>
			<button type="button" onClick={stop}>
				Stop
			</button>
		</div>
	);
}

function CountDisplay() {
	const { count } = CountStore.useReadState();
	const doubled = CountStore.useComputed(double);

	return (
		<div>
			<h1 className="title">count is {count}</h1>
			<h2>
				{count} * 2 = <span data-testid="doubled">{doubled}</span>
			</h2>
		</div>
	);
}

enableInterval(true);

function GlobalStateStoreDemo() {
	return (
		<div className="Counter">
			<CountDisplay />
			<CounterActions />
		</div>
	);
}

export default GlobalStateStoreDemo;
