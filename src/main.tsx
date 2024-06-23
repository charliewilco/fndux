import { createElement, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./demos/layout.tsx";
import GlobalStateStoreDemo from "./demos/GlobalStateStore/GlobalStateStore.tsx";
import "./index.css";
import PoolDemo from "./demos/Pool/PoolDemo.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{
				path: "/",
				element: createElement("div", null, "Welcome to the secret demo!"),
			},
			{
				path: "/fndux",
				element: <GlobalStateStoreDemo />,
			},
			{
				path: "/pool",
				element: <PoolDemo />,
			},
		],
	},
]);

const el = document.getElementById("root");

if (el === null) {
	throw new Error("Root element not found");
}

createRoot(el).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
