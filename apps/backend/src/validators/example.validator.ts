import { Request, Response, NextFunction } from 'express';
import { CreateExampleDto } from '@sims-ai/api-contract';

/**
 * Example Validator
 * 
 * RESPONSIBILITY:
 * - Validate incoming request data
 * - Use Zod schemas from packages/api-contract
 * - Return validation errors in consistent format
 * 
 * DO NOT:
 * - Implement business logic
 * - Access database
 */
export const validateCreateExample = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    CreateExampleDto.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: 'Validation failed', details: error });
  }
};

