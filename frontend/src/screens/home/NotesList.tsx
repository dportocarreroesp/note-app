import { X, Archive, Check, Pen, Plus } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/Card";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/Dropdown";

import { Input } from "@/components/Input";
import { useAuth } from "@/hooks/useAuth";
import { getAllNotesQuery, getAllTagsQuery, queryKeys } from "@/lib/queries";
import { Note } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
	addNoteTag,
	createNewNote,
	createNewTag,
	removeNoteTag,
	updateNote,
} from "@/lib/mutations";
import {
	DropdownMenuGroup,
	DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

function NotesList({
	selNote,
	handleCardSelect,
	selTags,
	setSelTags,
}: {
	selNote: string;
	handleCardSelect: (noteId: string) => void;
	selTags: string[];
	setSelTags: (tagIds: string[]) => void;
}) {
	const auth = useAuth();
	const queryClient = useQueryClient();

	const [showingArchive, setShowingArchive] = useState(false);
	const newTagRef = useRef<HTMLInputElement | null>(null);

	const { data: notesList } = useQuery({
		...getAllNotesQuery({ tagIds: selTags }),
		enabled: !!auth?.user?.id,
	});
	const { data: tags } = useQuery({
		...getAllTagsQuery(),
		enabled: !!auth?.user?.id,
	});

	const filteredNotes = useMemo(() => {
		return notesList?.filter((note) => note.is_archived === showingArchive);
	}, [notesList, showingArchive]);

	const { mutateAsync: createNoteMutation } = useMutation({
		mutationFn: createNewNote,
	});
	const { mutateAsync: createNewTagMutation } = useMutation({
		mutationFn: createNewTag,
	});

	async function handleNewNote() {
		try {
			const newNote = await createNoteMutation();
			handleCardSelect(newNote.id);
			toast.success("New note created successfully");
			queryClient.invalidateQueries({ queryKey: ["getAllNotes"] });
		} catch (error) {
			toast.error(
				"Something wrong happened while trying to create a new note :("
			);
		}
	}

	async function handleNewTag() {
		if (!newTagRef.current?.value) {
			return;
		}

		try {
			await createNewTagMutation({ name: newTagRef.current.value });
			toast.success("New tag created successfully");
			queryClient.invalidateQueries({ queryKey: queryKeys.getAllTags });
			newTagRef.current.value = "";
		} catch (error) {
			toast.error(
				"Something wrong happened while trying to create a new tag :("
			);
		}
	}

	function isTagChecked(tagId: string) {
		return selTags.some((tag) => tag === tagId);
	}

	function checkTag(tagId: string) {
		if (isTagChecked(tagId)) {
			const idx = selTags.findIndex((tag) => tag === tagId);
			if (idx >= 0) {
				const newSelTags = [
					...selTags.slice(0, idx),
					...selTags.slice(idx + 1),
				];
				setSelTags(newSelTags);
			}
		} else {
			setSelTags([...selTags, tagId]);
		}

		queryClient.invalidateQueries({
			queryKey: ["getAllNotes"],
		});
	}

	return (
		<div className="flex flex-col h-screen p-6">
			<div className="flex justify-around gap-5">
				<Input type="search" id="search" placeholder="Search..." />
				<Button
					className={!showingArchive ? "bg-secondary" : "bg-primary"}
					variant="outline"
					onClick={() => setShowingArchive(!showingArchive)}
				>
					<Archive className={`w-4 h-4`} />
				</Button>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">Filter</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56">
						<DropdownMenuLabel>Tags</DropdownMenuLabel>
						<DropdownMenuLabel>
							<Input placeholder="Add a new tag..." />
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{tags?.length
							? tags.map((tag) => (
									<DropdownMenuCheckboxItem
										key={tag.id}
										checked={isTagChecked(tag.id)}
										onClick={() => checkTag(tag.id)}
									>
										{tag.name}
									</DropdownMenuCheckboxItem>
							  ))
							: null}
					</DropdownMenuContent>
				</DropdownMenu>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button>
							<Plus className="w-4 h-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56">
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={handleNewNote}
								className="flex justify-around p-1"
							>
								<Button className="w-full">
									<Plus className="w-4 h-4" />
									Create a new note
								</Button>
							</DropdownMenuItem>
							<DropdownMenuLabel>
								<Input
									onKeyUp={(e) => {
										if (e.key === "Enter") {
											handleNewTag();
										}
									}}
									placeholder="Add a new tag..."
									ref={newTagRef}
								/>
							</DropdownMenuLabel>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="mt-6 flex flex-col gap-4 overflow-y-auto">
				{filteredNotes?.length
					? filteredNotes.map((note) => (
							<NoteCard
								key={note.id}
								data={note}
								selected={note.id === selNote}
								handleCardSelect={handleCardSelect}
							/>
					  ))
					: null}
			</div>
		</div>
	);
}

function NoteCard({
	data,
	selected,
	handleCardSelect,
}: {
	data: Note;
	selected: boolean;
	handleCardSelect: (noteId: string) => void;
}) {
	const auth = useAuth();
	const { id, title } = data;

	const [currentTitle, setCurrentTitle] = useState(data.title);
	const [editingTitle, setEditingTitle] = useState(false);

	const queryClient = useQueryClient();

	const { data: tags } = useQuery({
		...getAllTagsQuery(),
		enabled: !!auth?.user?.id,
	});
	const filteredTags = useMemo(() => {
		return (
			tags?.filter(
				(tag) =>
					!data.NoteTags.some((noteTag) => noteTag.tag_id === tag.id)
			) ?? []
		);
	}, [tags, data]);

	async function toggleTitleEdit() {
		setEditingTitle(!editingTitle);

		if (!editingTitle) {
			return;
		}

		try {
			await mutateAsync({ id: data.id, title: currentTitle });
			toast.success("Note title updated successfully");
			queryClient.invalidateQueries({ queryKey: ["getAllNotes"] });
		} catch (error) {
			toast.error(
				"Something wrong happened while trying to update note title :("
			);
		}
	}

	const { mutateAsync } = useMutation({ mutationFn: updateNote });

	const cardStyle = `${selected ? "bg-secondary" : ""} hover:cursor-pointer`;

	const { mutateAsync: rmNoteTageMutation } = useMutation({
		mutationFn: removeNoteTag,
	});
	const { mutateAsync: addNoteTagMutation } = useMutation({
		mutationFn: addNoteTag,
	});

	async function handleRmNoteTag(noteId: string, tagId: string) {
		try {
			await rmNoteTageMutation({ noteId, tagId });
			toast.success("Tag removed successfully");
			queryClient.invalidateQueries({ queryKey: ["getAllNotes"] });
		} catch (error) {
			toast.error(
				"Something wrong happened while trying to remove a tag from the note :("
			);
		}
	}

	async function handleAddNoteTag(noteId: string, tagId: string) {
		try {
			await addNoteTagMutation({ noteId, tagId });
			toast.success("Tag added successfully");
			queryClient.invalidateQueries({ queryKey: ["getAllNotes"] });
		} catch (error) {
			toast.error(
				"Something wrong happened while trying to add a tag to the note :("
			);
		}
	}

	return (
		<Card className={cardStyle} onClick={() => handleCardSelect(id)}>
			<CardHeader>
				<CardTitle className="flex justify-start items-center gap-1">
					{selected ? (
						<Button
							className="p-1 h-5 w-5"
							onClick={toggleTitleEdit}
						>
							{!editingTitle ? (
								<Pen className="h-3 w-4" />
							) : (
								<Check className="h-4 w-4" />
							)}
						</Button>
					) : null}
					{editingTitle && selected ? (
						<Input
							value={currentTitle}
							onChange={(e) => setCurrentTitle(e.target.value)}
						/>
					) : (
						title
					)}
				</CardTitle>
			</CardHeader>
			<CardFooter className="flex-wrap gap-2">
				{data.NoteTags.length
					? data.NoteTags.map((noteTag) => (
							<Badge
								key={noteTag.id}
								className={`bg-[${"#ff0000" ?? "#FFFFFF"}]`}
								variant={"outline"}
							>
								{noteTag.Tag.name}
								<Button
									className="w-3 h-3 p-0 relative right-0 top-0 translate-x-full -translate-y-1/2"
									onClick={() =>
										handleRmNoteTag(data.id, noteTag.tag_id)
									}
								>
									<X className="w-3 h-3" />
								</Button>
							</Badge>
					  ))
					: null}

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="h-4 w-4">
							<Badge>
								<Plus className="h-4 w-4" />
							</Badge>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-30">
						<DropdownMenuLabel>Tags</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{filteredTags?.length
							? filteredTags.map((tag) => (
									<DropdownMenuItem
										key={tag.id}
										onClick={() =>
											handleAddNoteTag(data.id, tag.id)
										}
									>
										<span>{tag.name}</span>
									</DropdownMenuItem>
							  ))
							: null}
					</DropdownMenuContent>
				</DropdownMenu>
			</CardFooter>
		</Card>
	);
}

export default NotesList;
