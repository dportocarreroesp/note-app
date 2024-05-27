import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

export type PrismaMock = DeepMockProxy<PrismaClient>;

export function getPrismaMock(): PrismaMock {
  return mockDeep<PrismaClient>();
}
