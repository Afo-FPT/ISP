import { ExampleRepository } from '../repositories/example.repository';
import { CreateExampleDto } from '@sims-ai/api-contract';

/**
 * Example Service
 * 
 * RESPONSIBILITY:
 * - Contains ALL business logic
 * - Coordinates between controllers and repositories
 * - Handles external integrations (e.g., n8n webhooks)
 * - Data transformation and validation
 * - Business rules enforcement
 * 
 * DO NOT:
 * - Access database directly (use repositories)
 * - Handle HTTP requests/responses (controllers do this)
 */
export class ExampleService {
  constructor(private exampleRepository: ExampleRepository) {}

  async getExample(id: string) {
    // Business logic here
    const example = await this.exampleRepository.findById(id);
    
    if (!example) {
      throw new Error('Example not found');
    }

    // Additional business logic, transformations, etc.
    return example;
  }

  async createExample(data: CreateExampleDto) {
    // Business logic validation
    // Data transformation
    // External API calls (e.g., n8n webhook)
    
    const example = await this.exampleRepository.create(data);
    
    // Post-creation logic (e.g., trigger webhook)
    // await this.triggerN8nWebhook(example);
    
    return example;
  }
}

