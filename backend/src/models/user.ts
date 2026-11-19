import mongoose from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  tokens: { token: string }[];
}

interface IUserModel extends mongoose.Model<IUser> {}

const userSchema = new mongoose.Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      required: false,
      default: "Ё-мое",
      minlength: [2, 'Минимальная длина поля "name" — 2 символа'],
      maxlength: [30, 'Максимальная длина поля "name" — 30 символов'],
    },
    email: {
      type: String,
      required: [true, 'Поле "email" должно быть заполнено'],
      unique: true,
      validate: {
        validator: (v: string) => /^\S+@\S+\.\S+$/.test(v),
        message: 'Поле "email" должно быть валидным email',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      minlength: [6, 'Минимальная длина поля "password" — 6 символов'],
      select: false,
    },
    tokens: [
      {
        _id: false,
        token: {
          type: String,
          required: [true, 'Поле "token" должно быть заполнено'],
        },
      },
    ],
  },
  {
    versionKey: false,
  },
);

export default mongoose.model<IUser, IUserModel>("user", userSchema);
