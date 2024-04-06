import {
	useCallback,
	useDebugValue,
	useMemo,
	useSyncExternalStore,
} from "react";

// biome-ignore lint/suspicious/noConfusingVoidType: I want this to return type of void or T
export function mutate<T>(value: T, mutator: (draft: T) => void | T): T {
	if (typeof value === "string") {
		return mutator(value) as T;
	}
	const draft = JSON.parse(JSON.stringify(value));
	mutator(draft);
	return draft;
}

type Setter<T> = (state: T) => T | Partial<T>;

export type CreateStoreActions<TState, TActions> = (
	set: (setter: Setter<TState>) => void
) => TActions;

interface FnHooks<TState, TActions> {
	/**
	 * Hook to get bound action handlers for use in components
	 * @returns TActions
	 */
	useAction: () => TActions;
	/**
	 * Hook to compute or select a subsection of state
	 * @param selector create subsection of state or computed value.
	 * @returns
	 */
	useComputed: <TSlice>(selector: (state: TState) => TSlice) => TSlice;
	/**
	 * Hook that returns the current state like `useState()`
	 * @returns TState
	 */
	useReadState: () => TState;
	/**
	 *
	 * @returns Mutator
	 */
	// biome-ignore lint/suspicious/noConfusingVoidType: I want this to return type of void or T
	useSafeMutate: () => (mutator: (draft: TState) => TState | void) => TState;
	/**
	 * Hook that returns whole store for safe use in components
	 * @returns Readonly<[TState, TActions]>
	 */
	useStore: () => Readonly<[TState, TActions]>;
}

interface FnExternals<TState> {
	getState: () => TState;
	subscribe: (listener: (value: TState) => void) => () => void;
	disposer: () => void;
}

interface FnStoreUnstable<TState, TActions> {
	/**
	 * use a setter manually
	 * Don't use this unless you're willing to risk it all
	 * @returns Setter<TState> => void
	 */
	unstable_set: () => (setter: Setter<TState>) => void;
	/**
	 * Returns bound action handlers to be used outside of component tree
	 * @returns TActions
	 */
	getBoundActions: () => TActions;
	/**
	 * Resets whole store to initial state passed to invokation
	 * @returns void
	 */
	reset: () => void;
}

type FnDux<S, A> = FnHooks<S, A> & FnExternals<S> & FnStoreUnstable<S, A>;

// TODO: Strict equality checks in notifications
// TODO: Type checking around setter function. A handler should be able to return Partial<T> or T
/**
 * Fundux Store creator
 *
 * @param initialState <TState>
 * @param actions <TActions>
 * @param options
 * @returns `Fundux<TState, TActions>`
 */
export function fnDuxStore<TState, TActions>(
	initialState: TState,
	actions: CreateStoreActions<TState, TActions>
): FnDux<TState, TActions> {
	let state: TState = Object.assign({}, initialState);

	const listeners = new Set<(value: TState) => void>();

	function subscribe(listener: (value: TState) => void): () => void {
		listeners.add(listener);

		return () => {
			listeners.delete(listener);
		};
	}

	function notify(newValue: TState): void {
		for (const l of listeners) {
			l(newValue);
		}
	}

	function disposer() {
		return listeners.clear();
	}

	function set(setter: Setter<TState>) {
		const newState = setter(getState());

		state = Object.assign({}, state, newState);

		notify(state);
	}

	const getState = (): TState => state;

	function useSafeMutate() {
		// biome-ignore lint/suspicious/noConfusingVoidType: I want this to return type of void or T
		return useCallback((mutator: (draft: TState) => void | TState) => {
			const _state = getState();
			const draft = mutate(_state, mutator);
			const newState = draft;
			const immutableValue = JSON.parse(JSON.stringify(newState));
			state = immutableValue;

			notify(immutableValue);

			return immutableValue;
		}, []);
	}

	function useAction(): TActions {
		return useMemo(() => actions(set), [actions]);
	}

	function useReadState(): TState {
		useDebugValue(state);
		return useSyncExternalStore(subscribe, getState, () => initialState);
	}

	function useComputed<TSlice>(selector: (state: TState) => TSlice): TSlice {
		const state = useReadState();
		// TODO replace with a memoized selector with a safe memoization
		return selector(state);
	}

	function useStore(): Readonly<[TState, TActions]> {
		const state = useReadState();
		const actions = useAction();
		return [state, actions];
	}

	return {
		useAction,
		useComputed,
		useReadState,
		useSafeMutate,
		useStore,
		getState,
		subscribe,
		disposer,
		unstable_set() {
			return set;
		},
		getBoundActions() {
			return actions(set);
		},
		reset() {
			const _initialState = Object.assign({}, initialState);

			state = _initialState;

			notify(_initialState);
		},
	};
}
