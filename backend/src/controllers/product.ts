import { Error as MongooseError } from "mongoose";
import { NextFunction, Request, Response } from "express";
import Product from "../models/product";
import BadRequestError from "../errors/bad-request-error";
import ConflictError from "../errors/conflict-error";

export const getProducts = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Product.find({})
    .then((products) => res.send({ items: products }))
    .catch(next);
};

export const createProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, image, category, description, price } = req.body;

  Product.create({ title, image, category, description, price })
    .then((product) => res.status(201).send({ data: product }))
    .catch((err) => {
      if (err instanceof Error && err.message.includes("E11000")) {
        return next(
          new ConflictError("Товар с таким названием уже существует"),
        );
      }
      if (err instanceof MongooseError.ValidationError) {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};
