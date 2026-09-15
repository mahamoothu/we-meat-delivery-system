import { PrismaClient } from '@prisma/client';
import { prisma } from '../config/prisma';

export abstract class BaseRepository {
  protected db: PrismaClient;

  constructor() {
    this.db = prisma;
  }
}
