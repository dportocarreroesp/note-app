import { Note } from "@/types";
import { config } from "./config";

type SignInData = {
	id: string;
	email: string;
};
export async function signIn({
	email,
	password,
}: {
	email: string;
	password: string;
}): Promise<SignInData> {
	const response = await fetch(`${config.API_URL}/auth/sign_in`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, password }),
		credentials: "include",
	});

	if (response.status !== 200 && response.status !== 201) {
		throw new Error("Failed to sign in");
	}

	// TODO: add validation using zod
	const data = await response.json();

	return data;
}

type UpdateNoteArgs = {
	id: string;
	title?: string;
	content?: string;
	isArchived?: boolean;
};
export async function updateNote(args: UpdateNoteArgs) {
	const response = await fetch(`${config.API_URL}/note/${args.id}`, {
		method: "PATCH",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(args),
		credentials: "include",
	});

	if (response.status !== 200 && response.status !== 201) {
		throw new Error("Failed to update note");
	}

	const data = await response.json();

	return data;
}

export async function deleteNote(noteId: string) {
	const response = await fetch(`${config.API_URL}/note/${noteId}`, {
		method: "DELETE",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		credentials: "include",
	});

	const data = await response.json();

	return data;
}

export async function addNoteTag({
	noteId,
	tagId,
}: {
	noteId: string;
	tagId: string;
}) {
	const response = await fetch(
		`${config.API_URL}/note/${noteId}/tag/${tagId}`,
		{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			credentials: "include",
		}
	);

	const data = await response.json();

	return data;
}

export async function removeNoteTag({
	noteId,
	tagId,
}: {
	noteId: string;
	tagId: string;
}) {
	const response = await fetch(
		`${config.API_URL}/note/${noteId}/tag/${tagId}`,
		{
			method: "DELETE",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			credentials: "include",
		}
	);

	const data = await response.json();

	return data;
}

export async function createNewNote(): Promise<Note> {
	const response = await fetch(`${config.API_URL}/note`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		credentials: "include",
	});

	if (response.status !== 200 && response.status !== 201) {
		throw new Error("Failed to create new note");
	}

	const data = await response.json();

	return data;
}

export async function createNewTag({ name }: { name: string }) {
	const response = await fetch(`${config.API_URL}/tag`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ name }),
		credentials: "include",
	});

	const data = await response.json();

	return data;
}
