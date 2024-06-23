import { createFnDuxStore } from "./fndux";

export interface CountState {
	count: number;
}

export function double(state: CountState) {
	return state.count * 2;
}

export const mutator = (draft: CountState) => {
	draft.count = draft.count / 3;
};

export const CountStore = createFnDuxStore(
	{
		count: 0,
	},
	(set) => {
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
	},
);
