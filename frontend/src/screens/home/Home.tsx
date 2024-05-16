import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/Resizable";
import { getAllNotesQuery } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import NoteDetails from "./NoteDetails";
import NotesList from "./NotesList";

function Home() {
	const auth = useAuth();
	const [selNote, setSelNote] = useState<string>("");
	const [selTags, setSelTags] = useState<string[]>([]);

	const { data: notesList } = useQuery({
		...getAllNotesQuery({ tagIds: selTags }),
		enabled: !!auth?.user?.id,
	});

	const selNoteData = useMemo(
		() => notesList?.find((note) => note.id === selNote),
		[notesList, selNote]
	);

	function handleCardSelect(noteId: string) {
		setSelNote(noteId);
	}

	return (
		<ResizablePanelGroup
			direction="horizontal"
			className="w-screen h-screen rounded-lg"
		>
			<ResizablePanel defaultSize={40}>
				<NotesList
					selNote={selNote}
					handleCardSelect={handleCardSelect}
					selTags={selTags}
					setSelTags={setSelTags}
				/>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={60}>
				<NoteDetails
					key={selNoteData?.id}
					data={selNoteData}
					handleCardSelect={handleCardSelect}
					selTagIds={selTags}
				/>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}

export default Home;
