import { describe, expect, test, vi } from "vitest";
import { Subscription } from "./subscription";

describe("Subscription", () => {
	test("should return a subscription object", () => {
		const subscription = new Subscription({ a: 1, b: 2 });
		expect(subscription).toBeInstanceOf(Subscription);
	});

	test("should return a subscription object with initial state", () => {
		const subscription = new Subscription({ a: 1, b: 2 });
		expect(subscription.getState()).toEqual({ a: 1, b: 2 });
	});

	test("should return a subscription object with updated state", () => {
		const subscription = new Subscription({ a: 1, b: 2 });
		subscription.set((state) => ({ a: state.a + 1, b: state.b + 1 }));
		expect(subscription.getState()).toEqual({ a: 2, b: 3 });
	});

	test("should return a subscription object with reset state", () => {
		const subscription = new Subscription({ a: 1, b: 2 });
		subscription.set((state) => ({ a: state.a + 1, b: state.b + 1 }));
		subscription.reset();
		expect(subscription.getState()).toEqual({ a: 1, b: 2 });
	});

	test("listeners should be notified when state changes", () => {
		const subscription = new Subscription({ a: 1, b: 2 });
		const listener = vi.fn();
		subscription.subscribe(listener);
		subscription.set((state) => ({ a: state.a + 1, b: state.b + 1 }));
		expect(listener).toHaveBeenCalledTimes(1);
		expect(listener).toHaveBeenCalledWith({ a: 2, b: 3 });
	});

	test("subscriptions can be unsubscribed", () => {
		const subscription = new Subscription({ a: 1, b: 2 });
		const listener = vi.fn();
		const unsubscribe = subscription.subscribe(listener);
		unsubscribe();
		subscription.set((state) => ({ a: state.a + 1, b: state.b + 1 }));
		expect(listener).not.toHaveBeenCalled();
	});

	test("disposer can clear all listeners", () => {
		const subscription = new Subscription({ a: 1, b: 2 });
		const listener = vi.fn();
		subscription.subscribe(listener);
		subscription.disposer();
		subscription.set((state) => ({ a: state.a + 1, b: state.b + 1 }));
		expect(listener).not.toHaveBeenCalled();
	});
});
