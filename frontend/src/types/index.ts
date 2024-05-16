export type User = {
	id: string;
	email: string;
};

export type Note = {
	id: string;
	created_at: string;
	updated_at: string;
	title: string;
	content?: string;
	owner_id: string;
	is_archived: boolean;

	NoteTags: NoteTag[];
};

export type NoteTag = {
	id: number;
	note_id: string;
	tag_id: string;
	Tag: Tag;
};

export type Tag = {
	id: string;
	name: string;
	color?: string;
	owner_id: string;
};
