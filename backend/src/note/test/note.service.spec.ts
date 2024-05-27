import { Test, TestingModule } from '@nestjs/testing';
import { Note } from '@prisma/client';
import { getPrismaMock, PrismaMock } from '../../prisma/prisma-mock';
import { PrismaService } from '../../prisma/prisma.service';
import { NoteService } from '../note.service';

describe('NoteService', () => {
  let service: NoteService;
  let prismaMock: PrismaMock;

  beforeEach(async () => {
    prismaMock = getPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
    expect(prismaMock).toBeDefined();
  });

  it('get note', async () => {
    const newNote: Note = {
      id: 'xxxx-xxxx-xxxx-xxxx',
      title: 'Test note title',
      content: 'test',
      created_at: new Date(),
      is_archived: false,
      owner_id: 'xxxx-xxxx-xxxx-xxxx',
      updated_at: new Date(),
    };
    prismaMock.note.create.mockResolvedValue(newNote);

    const x = await service.create(newNote.owner_id, {
      title: newNote.title,
      content: newNote.content,
    });

    expect(x.title).toEqual(newNote.title);
  });
});
