import { Router } from "express";
import { createOrder } from "../controllers/order";
import { createOrderValidator } from "../validators/orders";

const orderRouter = Router();

orderRouter.post("/", createOrderValidator, createOrder);

export default orderRouter;
