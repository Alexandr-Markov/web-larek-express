import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const ERROR_DEFAULT_MESSAGE = 'На сервере произошла ошибка';

export default (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }
  if (Joi.isError(err)) {
    return res.status(400).send({
      message: err.details.map((detail) => detail.message).join('; '),
    });
  }
  const statusCode = (err as { statusCode?: number }).statusCode ?? 500;
  const message = statusCode === 500 ? ERROR_DEFAULT_MESSAGE : err.message;
  return res.status(statusCode).send({ message });
};
