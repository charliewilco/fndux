export type Setter<T> = (state: T) => T | Partial<T>;

export class Subscription<T> {
	public listeners = new Set<(value: T) => void>();
	public state: T;
	constructor(public initialState: T) {
		this.state = Object.assign({}, initialState);
	}

	public subscribe(listener: (value: T) => void): () => void {
		this.listeners.add(listener);

		return () => {
			this.listeners.delete(listener);
		};
	}

	public notify(newValue: T): void {
		for (const l of this.listeners) {
			l(newValue);
		}
	}

	public disposer() {
		return this.listeners.clear();
	}

	public getState(): T {
		return this.state;
	}

	public set(setter: Setter<T>) {
		const newState = setter(this.getState());

		this.state = Object.assign({}, this.state, newState);

		this.notify(this.state);
	}

	public reset() {
		this.state = Object.assign({}, this.initialState);
		this.notify(this.state);
	}
}
