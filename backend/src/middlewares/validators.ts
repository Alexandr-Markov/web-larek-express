import { Joi, Segments, celebrate } from 'celebrate';

const productImage = Joi.object()
  .keys({
    fileName: Joi.string().required().messages({
      'any.required': 'Имя файла картинки обязательно',
    }),
    originalName: Joi.string().required().messages({
      'any.required': 'Оригинальное имя файла картинки обязательно',
    }),
  })
  .messages({
    'object.base': 'Поле image должно быть объектом',
  });

export const createProductValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина названия товара — 2 символа',
        'string.max': 'Максимальная длина названия товара — 30 символов',
        'any.required': 'Название товара обязательно',
      }),
    image: productImage.required().messages({
      'any.required': 'Поле image обязательно',
    }),
    category: Joi.string().required().messages({
      'any.required': 'Категория обязательна',
    }),
    description: Joi.string().optional(),
    price: Joi.number().min(0).allow(null).optional()
      .messages({
        'number.min': 'Цена не может быть отрицательной',
      }),
  }),
});

export const updateProductValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина названия товара — 2 символа',
      'string.max': 'Максимальная длина названия товара — 30 символов',
    }),
    image: productImage,
    category: Joi.string(),
    description: Joi.string(),
    price: Joi.number().min(0).allow(null).messages({
      'number.min': 'Цена не может быть отрицательной',
    }),
  }),
});

export const productIdValidator = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    productId: Joi.string().hex().length(24).required()
      .messages({
        'string.hex': 'productId должен быть в hex-формате',
        'string.length': 'productId должен содержать 24 hex-символа',
        'any.required': 'productId обязателен',
      }),
  }),
});

export const createOrderValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    payment: Joi.string().valid('card', 'online').required().messages({
      'any.only': 'Поле payment должно быть card или online',
      'any.required': 'Поле payment обязательно',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Поле email должно быть валидным email',
      'any.required': 'Поле email обязательно',
    }),
    phone: Joi.string().required().messages({
      'any.required': 'Поле phone обязательно',
    }),
    address: Joi.string().required().messages({
      'any.required': 'Поле address обязательно',
    }),
    total: Joi.number().required().messages({
      'number.base': 'Поле total должно быть числом',
      'any.required': 'Поле total обязательно',
    }),

    items: Joi.array()
      .items(
        Joi.string().hex().length(24).messages({
          'string.hex': 'id товара должен быть в hex-формате',
          'string.length': 'id товара должен содержать 24 hex-символа',
        }),
      )
      .min(1)
      .required()
      .messages({
        'array.base': 'Поле items должно быть массивом',
        'array.min': 'Поле items должно быть непустым массивом',
        'any.required': 'Поле items обязательно',
      }),
  }),
});

export const loginValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required().messages({
      'string.email': 'Поле email должно быть валидным email',
      'any.required': 'Поле email обязательно',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Минимальная длина пароля — 6 символов',
      'any.required': 'Поле password обязательно',
    }),
  }),
});

export const registerValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина имени — 2 символа',
      'string.max': 'Максимальная длина имени — 30 символов',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Поле email должно быть валидным email',
      'any.required': 'Поле email обязательно',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Минимальная длина пароля — 6 символов',
      'any.required': 'Поле password обязательно',
    }),
  }),
});
