import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService) {}

  create(ownerId: string, { title, content }: CreateNoteDto) {
    return this.prisma.note.create({
      data: { title, content, owner_id: ownerId },
    });
  }

  findAll(ownerId: string) {
    return this.prisma.note.findMany({
      where: {
        owner_id: ownerId,
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
    { title, content, is_archived }: UpdateNoteDto,
  ) {
    return this.prisma.note.update({
      where: {
        id,
        owner_id: ownerId,
      },
      data: {
        title,
        content,
        ...(is_archived !== undefined &&
          is_archived !== null && { is_archived }),
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
}
