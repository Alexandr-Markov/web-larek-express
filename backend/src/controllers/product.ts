import { Error as MongooseError, isValidObjectId } from "mongoose";
import { NextFunction, Request, Response } from "express";
import Product from "../models/product";
import {
  moveFileToImages,
  removeFileFromImages,
  isFileInTmp,
} from "../utils/file";
import BadRequestError from "../errors/bad-request-error";
import NotFoundError from "../errors/not-found-error";
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

interface ProductError extends Error {
  code?: number;
}

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, image, category, description, price } = req.body;
  let movedFileName: string | undefined;

  try {
    if (!isFileInTmp(image.fileName)) {
      return next(new BadRequestError("Файл изображения не найден на сервере"));
    }

    movedFileName = moveFileToImages(image.fileName);

    const product = await Product.create({
      title,
      image: { fileName: movedFileName, originalName: image.originalName },
      category,
      description,
      price,
    });

    return res.status(201).send({ data: product });
  } catch (err) {
    if (movedFileName) {
      removeFileFromImages(movedFileName);
    }
    if (err instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(err.message));
    }
    if ((err as ProductError).code === 11000) {
      return next(new ConflictError("Товар с таким названием уже существует"));
    }
    return next(err);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { productId } = req.params;
  const { title, image, category, description, price } = req.body;
  let movedFileName: string | undefined;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return next(new NotFoundError("Товар не найден"));
    }

    const oldFileName = product.image?.fileName;
    const newFileName = image?.fileName;

    if (newFileName && newFileName !== oldFileName) {
      if (!isFileInTmp(newFileName)) {
        return next(
          new BadRequestError("Файл изображения не найден на сервере"),
        );
      }
      movedFileName = moveFileToImages(newFileName);
    }

    const update: Record<string, unknown> = {};
    if (title !== undefined) update.title = title;
    if (category !== undefined) update.category = category;
    if (description !== undefined) update.description = description;
    if (price !== undefined) update.price = price;
    if (movedFileName) {
      update.image = {
        fileName: movedFileName,
        originalName: image.originalName,
      };
    }

    const updated = await Product.findByIdAndUpdate(productId, update, {
      new: true,
      runValidators: true,
    });

    if (movedFileName && oldFileName) {
      removeFileFromImages(oldFileName);
    }

    return res.send({ data: updated });
  } catch (err) {
    if (movedFileName) {
      removeFileFromImages(movedFileName);
    }
    if (err instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(err.message));
    }
    if ((err as ProductError).code === 11000) {
      return next(new ConflictError("Товар с таким названием уже существует"));
    }
    return next(err);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;

    const deleted = await Product.findByIdAndDelete(productId);
    if (!deleted) {
      return next(new NotFoundError("Товар не найден"));
    }

    return res.send({ data: deleted });
  } catch (err) {
    return next(err);
  }
};
