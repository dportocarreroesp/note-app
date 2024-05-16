import { createContext, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { config } from "../lib/config";
import { User } from "../types";

export const AuthContext = createContext<{
	user: User | null;
	login: (data: User) => Promise<void>;
	logout: () => void;
} | null>(null);

export const AuthProvider = () => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		fetch(`${config.API_URL}/auth`, {
			credentials: "include",
		})
			.then((data) => data.json())
			.then((data) => setUser(data));
	}, []);

	const navigate = useNavigate();

	const login = async (data: User) => {
		setUser(data);
		navigate("/");
	};

	const logout = () => {
		setUser(null);
		navigate("/sign_in", { replace: true });
	};

	const value = useMemo(
		() => ({
			user,
			login,
			logout,
		}),
		[user]
	);
	return (
		<AuthContext.Provider value={value}>
			<Outlet />
		</AuthContext.Provider>
	);
};
