// src/routes/bookRoutes.ts
import { Router } from 'express';
import {
    createBook,
    getBooks,
    getBook,
    updateBook,
    deleteBook,
    getUserBooks
} from '../controllers/bookController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { validateQuery } from '../middleware/validation';
import { bookSchema, bookQuerySchema } from '../utils/validationSchemas';

const router = Router();

router.get('/', validateQuery(bookQuerySchema), getBooks);
router.get('/my-books', authenticate, getUserBooks);
router.get('/:id', getBook);
router.post('/', authenticate, validate(bookSchema), createBook);
router.put('/:id', authenticate, validate(bookSchema), updateBook);
router.delete('/:id', authenticate, deleteBook);

export default router;