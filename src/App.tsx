import "./App.css";
import { CountStore, double, mutator } from "./Count";

// setInterval(() => {
// 	const { increment } = CountStore.getBoundActions();

// 	increment();
// }, 3000);

function CounterActions() {
	const safeMutate = CountStore.useSafeMutate();
	const { increment, decrement, pi } = CountStore.useAction();

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
		</div>
	);
}

function CountDisplay() {
	const { count } = CountStore.useReadState();
	const doubled = CountStore.useComputed(double);

	return (
		<div>
			<h1>count is {count}</h1>
			<h2>
				{count} * 2 = <span data-testid="doubled">{doubled}</span>
			</h2>
		</div>
	);
}

function App() {
	return (
		<div className="card">
			<CountDisplay />
			<CounterActions />
		</div>
	);
}

export default App;
