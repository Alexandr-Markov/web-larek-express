import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {
  CORS_URL, PORT, DB_ADDRESS, IMAGES_DIR,
} from './config';
import productRouter from './routes/product';
import orderRouter from './routes/order';
import authRouter from './routes/auth';
import uploadRouter from './routes/upload';
import error from './middlewares/error-handler';
import { requestLogger, errorLogger } from './middlewares/logger';
import NotFoundError from './errors/not-found-error';

import startTempCleanup from './utils/cleanup';

const app = express();

app.use(
  cors({
    origin: CORS_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use('/images', express.static(IMAGES_DIR));

mongoose.connect(DB_ADDRESS);

app.use('/product', productRouter);
app.use('/order', orderRouter);
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);

app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError(`Маршрут ${req.method} ${req.path} не найден`));
});

app.use(errors());
app.use(errorLogger);
app.use(error);

app.listen(PORT);
startTempCleanup();
