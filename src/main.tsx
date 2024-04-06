import { createElement, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const el = document.getElementById("root");

if (el === null) {
	throw new Error("Root element not found");
}

createRoot(el).render(createElement(StrictMode, null, createElement(App)));
