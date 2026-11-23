import { Router } from 'express';
import createOrder from '../controllers/order';
import { createOrderValidator } from '../middlewares/validators';

const orderRouter = Router();

orderRouter.post('/', createOrderValidator, createOrder);

export default orderRouter;
