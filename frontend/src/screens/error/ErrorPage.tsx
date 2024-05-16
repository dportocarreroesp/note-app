import { useRouteError } from "react-router-dom";

function ErrorPage() {
	const error: any = useRouteError();
	console.error(error);

	return (
		<div
			id="error-page"
			className="flex flex-col justify-center items-center h-screen w-screen"
		>
			<h1>Oops!</h1>
			<p>Sorry, an unexpected error has occurred.</p>
			<p>
				<i>{error?.statusText ?? error?.message ?? "GENERIC_ERROR"}</i>
			</p>
		</div>
	);
}

export default ErrorPage;
