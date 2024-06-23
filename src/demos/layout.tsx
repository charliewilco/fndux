import { Outlet, Link } from "react-router-dom";

export default function RootLayout() {
	return (
		<>
			<nav>
				<Link to="/fndux">Global State Manager</Link>
				<Link to="/pool">Super Secret</Link>
				<Link to="/network">Actual Secret</Link>
			</nav>

			<main>
				<Outlet />
			</main>
		</>
	);
}
