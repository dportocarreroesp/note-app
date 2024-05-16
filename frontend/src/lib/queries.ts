import { Note, Tag } from "@/types";
import { config } from "./config";

export const queryKeys = {
	getAllNotes: (args: GetAllNotesFilter) => ["getAllNotes", args],
	getAllTags: ["getAllTags"],
};

type GetAllNotesData = Note[];
type GetAllNotesFilter = {
	tagIds?: string[];
};
export async function getAllNotes(
	args: GetAllNotesFilter
): Promise<GetAllNotesData> {
	const response = await fetch(
		`${config.API_URL}/note${
			args.tagIds?.length ? "?tagIds=" + args.tagIds.toString() : ""
		}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			credentials: "include",
		}
	);

	if (response.status !== 200 && response.status !== 201) {
		throw new Error("Failed to get notes");
	}

	// TODO: add validation using zod
	const data = await response.json();

	return data;
}

export function getAllNotesQuery(args: GetAllNotesFilter) {
	return {
		queryKey: queryKeys.getAllNotes(args),
		queryFn: async () => getAllNotes(args),
	};
}

type GetAllTags = Tag[];
export async function getAllTags(): Promise<GetAllTags> {
	const response = await fetch(`${config.API_URL}/tag`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		credentials: "include",
	});

	if (response.status !== 200 && response.status !== 201) {
		throw new Error("Failed to get tags");
	}

	// TODO: add validation using zod
	const data = await response.json();

	return data;
}

export function getAllTagsQuery() {
	return {
		queryKey: queryKeys.getAllTags,
		queryFn: async () => getAllTags(),
	};
}
