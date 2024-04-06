import "react";
import "react/experimental";

declare module "react" {
	// biome-ignore lint/suspicious/noConfusingVoidType: ugh
	export function act(callback: () => void | undefined): void;
	export function act<T>(callback: () => T | Promise<T>): Promise<T>;
}
