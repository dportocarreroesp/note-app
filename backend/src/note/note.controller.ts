import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Request } from 'express';
import { getJwtPayload } from 'src/lib/utils';
import { FilterNoteDto } from './dto/filter-note.dto';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  create(@Req() request: Request, @Body() createNoteDto: CreateNoteDto) {
    const { id: userId } = getJwtPayload(request);

    return this.noteService.create(userId, createNoteDto);
  }

  @Get()
  findAll(@Req() request: Request, @Query('tagIds') tagIds?: string) {
    const { id: userId } = getJwtPayload(request);
    const parsedTagIds = tagIds?.split(',');

    return this.noteService.findAll(userId, { tagIds: parsedTagIds });
  }

  @Get(':id')
  findOne(@Req() request: Request, @Param('id') id: string) {
    const { id: userId } = getJwtPayload(request);

    return this.noteService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    const { id: userId } = getJwtPayload(request);

    return this.noteService.update(userId, id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    const { id: userId } = getJwtPayload(request);

    return this.noteService.remove(userId, id);
  }

  @Post(':noteId/tag/:tagId')
  addTag(
    @Req() request: Request,
    @Param('noteId') noteId: string,
    @Param('tagId') tagId: string,
  ) {
    const { id: userId } = getJwtPayload(request);

    return this.noteService.addTag(userId, noteId, tagId);
  }

  @Delete(':noteId/tag/:tagId')
  removeTag(
    @Req() request: Request,
    @Param('noteId') noteId: string,
    @Param('tagId') tagId: string,
  ) {
    const { id: userId } = getJwtPayload(request);

    return this.noteService.removeTag(userId, noteId, tagId);
  }
}
