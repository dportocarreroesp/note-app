import { Note } from '@prisma/client';

export class NoteEntity implements Note {
  id: string;
  created_at: Date;
  updated_at: Date;

  content: string;
  owner_id: string;
  is_archived: boolean;
  title: string;
}
