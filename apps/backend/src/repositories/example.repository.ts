import { prisma } from '../lib/prisma';
import { CreateExampleDto } from '@sims-ai/api-contract';

/**
 * Example Repository
 * 
 * RESPONSIBILITY:
 * - ONLY layer that accesses the database
 * - Uses Prisma client for database operations
 * - Returns domain models
 * - Handles database-specific logic
 * 
 * DO NOT:
 * - Implement business logic (services do this)
 * - Handle HTTP requests/responses
 * - Perform data validation beyond database constraints
 */
export class ExampleRepository {
  async findById(id: string) {
    return prisma.example.findUnique({
      where: { id },
    });
  }

  async create(data: CreateExampleDto) {
    return prisma.example.create({
      data,
    });
  }

  async update(id: string, data: Partial<CreateExampleDto>) {
    return prisma.example.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.example.delete({
      where: { id },
    });
  }
}

