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
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { getJwtPayload } from 'src/lib/utils';
import { Request } from 'express';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Req() request: Request, @Body() createTagDto: CreateTagDto) {
    const { id: userId } = getJwtPayload(request);

    return this.tagService.create(userId, createTagDto);
  }

  @Get()
  findAll(@Req() request: Request) {
    const { id: userId } = getJwtPayload(request);

    return this.tagService.findAll(userId);
  }

  @Patch(':id')
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    const { id: userId } = getJwtPayload(request);

    return this.tagService.update(userId, id, updateTagDto);
  }

  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    const { id: userId } = getJwtPayload(request);

    return this.tagService.remove(userId, id);
  }
}
