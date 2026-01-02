import { Request, Response } from 'express';
import { ExampleService } from '../services/example.service';

/**
 * Example Controller
 * 
 * RESPONSIBILITY:
 * - Handle HTTP requests and responses only
 * - Extract data from request (params, body, query)
 * - Call appropriate service methods
 * - Return formatted responses
 * - Handle HTTP status codes
 * 
 * DO NOT:
 * - Access database directly
 * - Implement business logic
 * - Perform data validation (use validators middleware)
 */
export class ExampleController {
  constructor(private exampleService: ExampleService) {}

  async getExample(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.exampleService.getExample(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createExample(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const result = await this.exampleService.createExample(data);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

