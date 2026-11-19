import { Joi, Segments, celebrate } from "celebrate";

export const createProductValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(2).max(30).required().messages({
      "string.min": "Минимальная длина названия товара — 2 символа",
      "string.max": "Максимальная длина названия товара — 30 символов",
      "any.required": "Название товара обязательно",
    }),
    image: Joi.object()
      .keys({
        fileName: Joi.string().required().messages({
          "any.required": "Имя файла картинки обязательно",
        }),
        originalName: Joi.string().required().messages({
          "any.required": "Оригинальное имя файла картинки обязательно",
        }),
      })
      .required()
      .messages({
        "object.base": "Поле image должно быть объектом",
        "any.required": "Поле image обязательно",
      }),
    category: Joi.string().required().messages({
      "any.required": "Категория обязательна",
    }),
    description: Joi.string().optional(),
    price: Joi.number().allow(null).optional(),
  }),
});
