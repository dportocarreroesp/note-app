import { Tag } from '@prisma/client';

export class TagEntity implements Tag {
  id: string;
  name: string;
  color: string;
  owner_id: string;
}
