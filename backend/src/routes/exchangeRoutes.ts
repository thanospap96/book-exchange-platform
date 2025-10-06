import { Router } from 'express';
import {
    requestExchange,
    getExchangeRequests,
    getExchange,
    updateExchangeStatus,
    deleteExchangeRequest
} from '../controllers/exchangeController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { exchangeSchema } from '../utils/validationSchemas';

const router = Router();

router.get('/', authenticate, getExchangeRequests);
router.get('/:id', authenticate, getExchange);
router.post('/', authenticate, validate(exchangeSchema), requestExchange);
router.put('/:id/status', authenticate, updateExchangeStatus);
router.delete('/:id', authenticate, deleteExchangeRequest);

export default router;
