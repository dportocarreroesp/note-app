import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "./components/Toaster";
import { AuthProvider } from "./context/AuthProvider";
import { ReactQueryClientProvider } from "./context/ReactQueryClientProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import ErrorPage from "./screens/error/ErrorPage";
import Home from "./screens/home/Home";
import SignIn from "./screens/sign_in/SignIn";

function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: (
				<ReactQueryClientProvider>
					<ThemeProvider
						defaultTheme="dark"
						storageKey="vite-ui-theme"
					>
						<AuthProvider />
						<Toaster closeButton richColors position="top-right" />
					</ThemeProvider>
				</ReactQueryClientProvider>
			),
			errorElement: <ErrorPage />,
			children: [
				{ index: true, element: <SignIn /> },
				{
					path: "notes",
					element: (
						<ProtectedRoute>
							<Home />
						</ProtectedRoute>
					),
				},
				{
					path: "sign_in",
					element: <SignIn />,
				},
			],
		},
	]);

	return <RouterProvider router={router} />;
}

export default App;
