import { Joi, Segments, celebrate } from "celebrate";

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
