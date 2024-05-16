import { Pen, Check, Notebook, Archive, Trash } from "lucide-react";
import { Button } from "@/components/Button";
import { useState } from "react";
import Markdown from "react-markdown";
import { Note } from "@/types";
import { Textarea } from "@/components/Textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote, updateNote } from "@/lib/mutations";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queries";

function NoteDetails({
	data,
	handleCardSelect,
	selTagIds,
}: {
	data?: Note;
	handleCardSelect: (noteId: string) => void;
	selTagIds: string[];
}) {
	const [editing, setEditing] = useState(false);

	const [content, setContent] = useState(data?.content ?? "");
	const queryClient = useQueryClient();

	async function toggleEditing() {
		setEditing(!editing);

		if (!editing || !data?.id) {
			return;
		}

		try {
			await updateNoteMutation({ id: data.id, content });
			toast.success("Note updated successfully");
			queryClient.invalidateQueries({
				queryKey: queryKeys.getAllNotes({ tagIds: selTagIds }),
			});
		} catch (error) {
			toast.error(
				"Something wrong happened while trying to update the note :("
			);
		}
	}

	async function handleArchiveNote() {
		if (!data?.id) {
			return;
		}

		try {
			await updateNoteMutation({
				id: data.id,
				isArchived: !data.is_archived,
			});
			toast.success("Note archived successfully");
			handleCardSelect("");
			queryClient.invalidateQueries({
				queryKey: queryKeys.getAllNotes({ tagIds: selTagIds }),
			});
		} catch (error) {
			toast.error(
				"Something wrong happened while trying to archive the note :("
			);
		}
	}

	async function handleDeleteNote() {
		if (!data?.id) {
			return;
		}

		try {
			await deleteNoteMutation(data.id);
			toast.success("Note deleted successfully");
			handleCardSelect("");
			queryClient.invalidateQueries({
				queryKey: queryKeys.getAllNotes({ tagIds: selTagIds }),
			});
		} catch (error) {
			toast.error(
				"Something wrong happened while trying to delete the note :("
			);
		}
	}

	const { mutateAsync: updateNoteMutation } = useMutation({
		mutationFn: updateNote,
	});
	const { mutateAsync: deleteNoteMutation } = useMutation({
		mutationFn: deleteNote,
	});

	return (
		<div className="h-screen overflow-y-auto p-4">
			{data ? (
				<div className="h-full">
					{editing ? (
						<Textarea
							placeholder="Edit your note..."
							className="resize-none h-full"
							value={content}
							onChange={(e) => setContent(e.target.value)}
						/>
					) : (
						<Markdown className="prose dark:prose-invert">
							{content ?? ""}
						</Markdown>
					)}

					<div className="absolute flex gap-2 bottom-5 left-[80%]">
						<Button
							className={`h-16 w-16 ${
								!data.is_archived
									? "bg-yellow-500"
									: "bg-green-600"
							}`}
							type="button"
							variant="outline"
							size="icon"
							onClick={handleArchiveNote}
						>
							<Archive className="h-11 w-11" />
						</Button>
						<Button
							className="h-16 w-16 bg-red-600"
							type="button"
							variant="outline"
							size="icon"
							onClick={handleDeleteNote}
						>
							<Trash className="h-11 w-11" />
						</Button>
						<Button
							className={`h-16 w-16 ${
								!editing ? "bg-blue-400" : "bg-green-600"
							} `}
							type="button"
							variant="outline"
							size="icon"
							onClick={toggleEditing}
						>
							{editing ? (
								<Check className="h-11 w-11" />
							) : (
								<Pen className="h-11 w-11" />
							)}
						</Button>
					</div>
				</div>
			) : (
				<NoteNotSelected />
			)}
		</div>
	);
}

function NoteNotSelected() {
	return (
		<div className="h-full w-full flex justify-center items-center">
			<div className="flex flex-col items-center justify-center opacity-70 text-primary">
				<Notebook className="h-24 w-24 mb-4" />
				<h1>Nothing selected</h1>
			</div>
		</div>
	);
}

export default NoteDetails;
