import { Router } from "express";
import auth from "../middlewares/auth";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} from "../controllers/product";
import {
  createProductValidator,
  updateProductValidator,
  productIdValidator,
} from "../middlewares/validators";

const productRouter = Router();

productRouter.get("/", getProducts);
productRouter.post("/", auth, createProductValidator, createProduct);
productRouter.patch("/:productId", auth, updateProductValidator, updateProduct);
productRouter.delete("/:productId", auth, productIdValidator, deleteProduct);

export default productRouter;
