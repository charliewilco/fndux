import "./App.css";
import { CountStore, double, mutator } from "./Count";

function CounterActions() {
	const safeMutate = CountStore.useSafeMutate();
	const { increment, decrement, pi } = CountStore.useAction();

	return (
		<div>
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
			count is {count} * 2 = {doubled}
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
