import mongoose from "mongoose";

interface IProduct {
  title: string;
  image: {
    fileName: string;
    originalName: string;
  };
  category: string;
  description?: string;
  price: number | null;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    title: {
      type: String,
      unique: true,
      required: [true, 'Поле "title" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "title" — 2 символа'],
      maxlength: [30, 'Максимальная длина поля "title" — 30 символов'],
    },
    image: {
      fileName: {
        type: String,
        required: [true, 'Поле "fileName" должно быть заполнено'],
      },
      originalName: {
        type: String,
        required: [true, 'Поле "originalName" должно быть заполнено'],
      },
      _id: false,
    },
    category: {
      type: String,
      required: [true, 'Поле "category" должно быть заполнено'],
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: null,
      validate: {
        validator: (v: number | null) => v === null || v > 0,
        message: "Цена должна быть положительным числом или null",
      },
    },
  },
  {
    versionKey: false,
  },
);

export default mongoose.model<IProduct>("product", productSchema);
