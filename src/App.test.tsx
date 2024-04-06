// @vitest-environment happy-dom
import App from "./App";
import { test, expect } from "vitest";
import { act } from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

test("renders counter app", () => {
	render(<App />);
	const button = screen.getByText(/Mutate/i);
	const count = screen.getByText(/count is 0/i);
	expect(button).toBeInTheDocument();
	expect(count).toBeInTheDocument();
});

test("mutates count", async () => {
	render(<App />);
	const button = screen.getByText(/Mutate/i);
	const count = screen.getByText(/count is 0/i);
	const double = screen.getByTestId(/double/i);

	expect(count).toBeInTheDocument();
	expect(double).toBeInTheDocument();
	expect(button).toBeInTheDocument();

	act(() => {
		button.click();
	});

	expect(count).toHaveTextContent("count is 0");
});
