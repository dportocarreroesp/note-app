import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { signIn } from "@/lib/mutations";

function SignIn() {
	const auth = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (auth?.user?.id) {
			navigate("/notes");
		}
	}, [auth?.user]);

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();

		try {
			if (!email.current?.value || !password.current?.value) {
				return;
			}

			const data = await mutateAsync({
				email: email.current.value,
				password: password.current.value,
			});

			auth?.login(data);
			toast.success("Signed in successfully!");
		} catch (error) {
			toast.error("Failed to sign in :(");
		}
	}

	function togglePwdHidden() {
		setPwdHidden(!pwdHidden);
	}

	const email = useRef<HTMLInputElement | null>(null);
	const password = useRef<HTMLInputElement | null>(null);
	const [pwdHidden, setPwdHidden] = useState(true);

	const { mutateAsync } = useMutation({ mutationFn: signIn });

	return (
		<div className="h-screen w-screen flex items-center justify-center">
			<Card className="w-96">
				<CardHeader>
					<CardTitle>Sign in</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className="grid w-full max-w-sm items-center gap-1.5">
							<Label htmlFor="email">Email</Label>
							<Input
								type="email"
								id="email"
								placeholder="Email"
								ref={email}
							/>
						</div>
						<div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
							<Label htmlFor="password">Password</Label>
							<div className="flex w-full max-w-sm items-center space-x-2">
								<Input
									type={pwdHidden ? "password" : "text"}
									id="password"
									placeholder="Password"
									ref={password}
								/>
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={togglePwdHidden}
								>
									{pwdHidden ? (
										<Eye className="h-4 w-4" />
									) : (
										<EyeOff className="h-4 w-4" />
									)}
								</Button>
							</div>
							<Button type="submit" className="mt-8">
								Sign in
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

export default SignIn;
