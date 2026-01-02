import { Router } from 'express';
import { ExampleController } from '../../../controllers/example.controller';
import { ExampleService } from '../../../services/example.service';
import { ExampleRepository } from '../../../repositories/example.repository';
import { validateCreateExample } from '../../../validators/example.validator';

const router = Router();

// Dependency injection
const exampleRepository = new ExampleRepository();
const exampleService = new ExampleService(exampleRepository);
const exampleController = new ExampleController(exampleService);

// Routes
router.get('/:id', (req, res) => exampleController.getExample(req, res));
router.post('/', validateCreateExample, (req, res) => exampleController.createExample(req, res));

export default router;

