import { faker } from "@faker-js/faker";
import { NextFunction, Request, Response } from "express";
import Product from "../models/product";
import BadRequestError from "../errors/bad-request-error";

export const createOrder = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { payment, email, phone, address, total, items } = req.body;

  Product.find({ _id: { $in: items } })
    .then((products) => {
      if (products.length !== items.length) {
        return next(
          new BadRequestError("Некоторые товары из заказа не найдены"),
        );
      }
      const notForSale = products.filter((product) => product.price === null);
      if (notForSale.length > 0) {
        return next(
          new BadRequestError(
            `Товары без цены не могут быть проданы: ${notForSale.map((p) => p.title).join(", ")}`,
          ),
        );
      }
      const sum = products.reduce(
        (acc, product) => acc + (product.price ?? 0),
        0,
      );
      if (sum !== total) {
        return next(
          new BadRequestError(
            `Общая сумма заказа (${total}) не совпадает со стоимостью товаров (${sum})`,
          ),
        );
      }
      return res.status(201).send({ id: faker.string.uuid(), total });
    })
    .catch(next);
};
