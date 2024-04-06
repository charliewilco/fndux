// @vitest-environment happy-dom
import { test, expect, describe, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { fnDuxStore, mutate } from "./fndux";

import { CountStore as Count, double } from "./Count";

describe("Fundux", () => {
	beforeEach(() => {
		Count.reset();
	});

	describe("Basic counter implementation", () => {
		test("has state", () => {
			expect(Count.getState()).toEqual({ count: 0 });
		});
		test("increments", () => {
			expect(Count.getState()).toEqual({ count: 0 });

			Count.getBoundActions().increment();
			expect(Count.getState()).toEqual({ count: 1 });
		});
		test("decrements", () => {
			expect(Count.getState()).toEqual({ count: 0 });

			Count.getBoundActions().decrement();
			expect(Count.getState()).toEqual({ count: -1 });
		});

		test("pi", () => {
			expect(Count.getState()).toEqual({ count: 0 });
			Count.getBoundActions().increment();
			Count.getBoundActions().pi();
			expect(Count.getState()).toEqual({ count: Math.PI });
		});

		test("resets", () => {
			expect(Count.getState()).toEqual({ count: 0 });

			Count.getBoundActions().increment();
			expect(Count.getState()).toEqual({ count: 1 });

			Count.getBoundActions().reset();
			expect(Count.getState()).toEqual({ count: 0 });
		});
	});

	describe("Hooks", () => {
		test("useStore", () => {
			const { result } = renderHook(() => Count.useStore());
			const [state, actions] = result.current;

			expect(state).toEqual({ count: 0 });
			expect(typeof actions.increment).toBe("function");
			expect(typeof actions.decrement).toBe("function");
			expect(typeof actions.reset).toBe("function");
		});

		test("useAction", () => {
			const { result } = renderHook(() => Count.useAction());
			const actions = result.current;

			act(() => {
				result.current.increment();
			});

			expect(Count.getState()).toEqual({ count: 1 });

			act(() => {
				result.current.decrement();
			});

			expect(Count.getState()).toEqual({ count: 0 });

			expect(typeof actions.increment).toBe("function");
			expect(typeof actions.decrement).toBe("function");
			expect(typeof actions.reset).toBe("function");
		});

		test("useComputed", () => {
			const { result } = renderHook(() => Count.useComputed(double));

			expect(result.current).toBe(0);

			act(() => {
				Count.getBoundActions().increment();
			});

			expect(result.current).toBe(2);
		});

		test("useSafeMutate", () => {
			const { result } = renderHook(() => Count.useSafeMutate());

			act(() => {
				result.current((state) => {
					state.count = 45;
				});
			});

			expect(Count.getState()).toEqual({ count: 45 });
		});
	});

	describe("internals", () => {
		const _store = fnDuxStore({ count: 0 }, (set) => ({
			increment: () => {
				set((draft) => {
					return {
						count: draft.count + 1,
					};
				});
			},
			decrement: () => {
				set((draft) => {
					return {
						count: draft.count - 1,
					};
				});
			},
			reset: () => {
				set(() => {
					return {
						count: 0,
					};
				});
			},
		}));

		test("subscribes", () => {
			const listener = vi.fn();

			const unsubscribe = _store.subscribe(listener);

			_store.getBoundActions().increment();

			expect(listener).toHaveBeenCalledTimes(1);

			unsubscribe();

			_store.getBoundActions().increment();

			expect(listener).toHaveBeenCalledTimes(1);
		});

		test("disposes", () => {
			const listener = vi.fn();

			const unsubscribe = _store.subscribe(listener);

			_store.disposer();

			expect(listener).toHaveBeenCalledTimes(0);
			expect(typeof unsubscribe).toBe("function");
		});

		test("unstable_set", () => {
			_store.unstable_set()(() => {
				return {
					count: 10,
				};
			});

			expect(_store.getState()).toEqual({ count: 10 });
		});
	});

	describe("mutate", () => {
		test("mutates", () => {
			const state = { count: 0 };

			const newState = mutate(state, (draft) => {
				draft.count = 1;
			});

			expect(newState).toEqual({ count: 1 });
		});

		test("mutates with string", () => {
			const state = "hello";

			const newState = mutate(state, (draft) => {
				return draft.toUpperCase();
			});

			expect(newState).toEqual("HELLO");
		});
	});
});
