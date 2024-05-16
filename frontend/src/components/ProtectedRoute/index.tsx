import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	const auth = useAuth();
	if (!auth?.user) {
		return <Navigate to="/sign_in" />;
	}

	return <>{children}</>;
};
