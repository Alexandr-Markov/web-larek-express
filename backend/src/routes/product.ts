import { Router } from "express";
import { getProducts, createProduct } from "../controllers/product";
import { createProductValidator } from "../validators/products";

const productRouter = Router();

productRouter.get("/", getProducts);
productRouter.post("/", createProductValidator, createProduct);

export default productRouter;
