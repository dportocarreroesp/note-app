import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { FilterNoteDto } from './dto/filter-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

const DEFAULT_NOTE_TITLE = 'New Note';
const DEFAULT_NOTE_CONTENT = `
# This is a new note

Try using markdown to edit it
`;

@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService) {}

  create(ownerId: string, { title, content }: CreateNoteDto) {
    return this.prisma.note.create({
      data: {
        title: title ?? DEFAULT_NOTE_TITLE,
        content: content ?? DEFAULT_NOTE_CONTENT,
        owner_id: ownerId,
      },
    });
  }

  findAll(ownerId: string, filterNoteDto: FilterNoteDto) {
    return this.prisma.note.findMany({
      where: {
        owner_id: ownerId,
        ...(filterNoteDto?.tagIds?.length && {
          NoteTags: {
            some: {
              tag_id: {
                in: filterNoteDto.tagIds,
              },
            },
          },
        }),
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        NoteTags: {
          include: {
            Tag: true,
          },
        },
      },
    });
  }

  findOne(ownerId: string, id: string) {
    return this.prisma.note.findFirst({
      where: {
        owner_id: ownerId,
        id,
      },
    });
  }

  update(
    ownerId: string,
    id: string,
    { title, content, isArchived }: UpdateNoteDto,
  ) {
    return this.prisma.note.update({
      where: {
        id,
        owner_id: ownerId,
      },
      data: {
        title,
        content,
        ...(isArchived !== undefined &&
          isArchived !== null && { is_archived: isArchived }),
      },
    });
  }

  remove(ownerId: string, id: string) {
    return this.prisma.note.delete({
      where: {
        owner_id: ownerId,
        id,
      },
    });
  }

  addTag(userId: string, noteId: string, tagId: string) {
    const note = this.prisma.note.findFirst({
      where: {
        id: noteId,
        owner_id: userId,
      },
    });
    const tag = this.prisma.note.findFirst({
      where: {
        owner_id: userId,
        id: tagId,
      },
    });

    if (!note || !tag) {
      throw new UnauthorizedException();
    }

    return this.prisma.noteTags.create({
      data: {
        note_id: noteId,
        tag_id: tagId,
      },
    });
  }

  removeTag(userId: string, noteId: string, tagId: string) {
    return this.prisma.noteTags.deleteMany({
      where: {
        note_id: noteId,
        tag_id: tagId,
        Note: {
          owner_id: userId,
        },
      },
    });
  }
}
