import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findOne(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }
}
