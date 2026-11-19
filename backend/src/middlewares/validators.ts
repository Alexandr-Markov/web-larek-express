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
    price: Joi.number().min(0).allow(null).optional().messages({
      "number.min": "Цена не может быть отрицательной",
    }),
  }),
});

export const createOrderValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    payment: Joi.string().valid("card", "online").required().messages({
      "any.only": "Поле payment должно быть card или online",
      "any.required": "Поле payment обязательно",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Поле email должно быть валидным email",
      "any.required": "Поле email обязательно",
    }),
    phone: Joi.string().required().messages({
      "any.required": "Поле phone обязательно",
    }),
    address: Joi.string().required().messages({
      "any.required": "Поле address обязательно",
    }),
    total: Joi.number().required().messages({
      "number.base": "Поле total должно быть числом",
      "any.required": "Поле total обязательно",
    }),
    items: Joi.array()
      .items(Joi.string().required())
      .min(1)
      .required()
      .messages({
        "array.base": "Поле items должно быть массивом",
        "array.min": "Поле items должно быть непустым массивом",
        "any.required": "Поле items обязательно",
      }),
  }),
});
