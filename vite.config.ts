/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	test: {
		environment: "happy-dom",
		globals: true,
		coverage: {
			enabled: true,
			provider: "v8",
			thresholds: {
				lines: 90,
				statements: 90,
				branches: 90,
				functions: 90,
			},
			exclude: ["src/main.tsx"],
		},
	},
});
