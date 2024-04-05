import { fnDuxStore } from "./fndux";
import type { CreateStoreActions } from "./fndux";

export interface CountState {
	count: number;
}

interface CountActions {
	increment: () => void;
	decrement: () => void;
	reset: () => void;
	pi: () => void;
}

export function double(state: CountState) {
	return state.count * 2;
}

export const mutator = (draft: CountState) => {
	draft.count = draft.count / 3;
};

const _: CreateStoreActions<CountState, CountActions> = (set) => {
	return {
		increment: () => {
			set((state) => ({ count: state.count + 1 }));
		},
		decrement: () => {
			set((state) => ({ count: state.count - 1 }));
		},
		reset: () => {
			set(() => ({ count: 0 }));
		},

		pi: () => {
			set((state) => ({ count: state.count * Math.PI }));
		},
	};
};

const _init: CountState = { count: 0 };

export const CountStore = fnDuxStore(_init, _);
