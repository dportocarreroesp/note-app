import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Request } from 'express';
import { getJwtPayload } from 'src/lib/utils';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  create(@Req() request: Request, @Body() createNoteDto: CreateNoteDto) {
    const { id: userId } = getJwtPayload(request);

    return this.noteService.create(userId, createNoteDto);
  }

  @Get()
  findAll(@Req() request: Request) {
    const { id: userId } = getJwtPayload(request);

    return this.noteService.findAll(userId);
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
}
