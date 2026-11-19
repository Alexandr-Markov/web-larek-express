import path from "path";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { errors } from "celebrate";
import cors from "cors";
import productRouter from "./routes/product";
import orderRouter from "./routes/order";
import error from "./middlewares/error-handler";
import { requestLogger, errorLogger } from "./middlewares/logger";
import NotFoundError from "./errors/not-found-error";

const { PORT = 3000, DB_ADDRESS = "mongodb://127.0.0.1:27017/weblarek" } =
  process.env;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(DB_ADDRESS)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

app.use(requestLogger);

app.use("/product", productRouter);
app.use("/order", orderRouter);

app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError(`Маршрут ${req.method} ${req.path} не найден`));
});

app.use(errors());

app.use(errorLogger);

app.use(error);

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
