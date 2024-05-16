import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

const DEFAULT_TAG_NAME = 'New tag';
const DEFAULT_TAG_COLOR = '#FFFFFF';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  create(ownerId: string, createTagDto: CreateTagDto) {
    return this.prisma.tag.create({
      data: {
        name: createTagDto.name ?? DEFAULT_TAG_NAME,
        color: createTagDto.color ?? DEFAULT_TAG_COLOR,
        owner_id: ownerId,
      },
    });
  }

  findAll(ownerId: string) {
    return this.prisma.tag.findMany({
      where: {
        owner_id: ownerId,
      },
    });
  }

  update(ownerId: string, tagId: string, updateTagDto: UpdateTagDto) {
    return this.prisma.tag.update({
      where: {
        owner_id: ownerId,
        id: tagId,
      },
      data: {
        name: updateTagDto.name,
        color: updateTagDto.color,
      },
    });
  }

  remove(ownerId: string, tagId: string) {
    return this.prisma.tag.delete({
      where: {
        owner_id: ownerId,
        id: tagId,
      },
    });
  }
}
