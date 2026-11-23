import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError, HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';
import ms from 'ms';
import User, { IUser } from '../models/user';
import { AUTH_REFRESH_TOKEN_EXPIRY } from '../config';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import UnauthorizedError from '../errors/unauthorized-error';
import { signAccessToken, signRefreshToken, verifyToken } from '../utils/jwt';

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: false,
  maxAge: ms(AUTH_REFRESH_TOKEN_EXPIRY),
  path: '/',
};

const sendAuthResponse = (res: Response, user: HydratedDocument<IUser>) => {
  const payload = { _id: String(user._id) };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  res.cookie('refreshToken', refreshToken, refreshCookieOptions);
  return res.send({
    user: { email: user.email, name: user.name },
    success: true,
    accessToken,
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    const refreshToken = signRefreshToken({ _id: String(user._id) });
    user.tokens.push({ token: refreshToken });
    await user.save();
    res.status(201);
    return sendAuthResponse(res, user);
  } catch (err) {
    if (err instanceof Error && err.message.includes('E11000')) {
      return next(
        new ConflictError('Пользователь с такой почтой уже существует'),
      );
    }
    if (err instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(err.message));
    }
    return next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Неверная почта или пароль');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Неверная почта или пароль');
    }
    const refreshToken = signRefreshToken({ _id: String(user._id) });
    user.tokens.push({ token: refreshToken });
    await user.save();
    return sendAuthResponse(res, user);
  } catch (err) {
    return next(err);
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(new UnauthorizedError('Refresh-токен не найден в куках'));
  }
  const payload = verifyToken(refreshToken);
  if (!payload) {
    return next(new UnauthorizedError('Refresh-токен просрочен или невалиден'));
  }
  try {
    const user = await User.findById(payload._id);
    if (!user) {
      return next(
        new UnauthorizedError('Пользователь по refresh-токену не найден'),
      );
    }
    user.tokens = user.tokens.filter((t) => t.token !== refreshToken);
    const newRefreshToken = signRefreshToken({ _id: String(user._id) });
    user.tokens.push({ token: newRefreshToken });
    await user.save();
    res.cookie('refreshToken', newRefreshToken, refreshCookieOptions);
    return res.send({
      user: { email: user.email, name: user.name },
      success: true,
      accessToken: signAccessToken({ _id: String(user._id) }),
    });
  } catch (err) {
    return next(err);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(new UnauthorizedError('Refresh-токен не найден в куках'));
  }
  const payload = verifyToken(refreshToken);
  if (!payload) {
    return next(new UnauthorizedError('Refresh-токен невалиден'));
  }
  if (!/^[0-9a-fA-F]{24}$/.test(payload._id)) {
    return next(
      new BadRequestError('Невалидный идентификатор пользователя в токене'),
    );
  }
  try {
    const user = await User.findById(payload._id);
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    user.tokens = user.tokens.filter((t) => t.token !== refreshToken);
    await user.save();
    res.clearCookie('refreshToken', refreshCookieOptions);
    return res.send({ success: true });
  } catch (err) {
    return next(err);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.send({
      user: { email: user.email, name: user.name },
      success: true,
    });
  } catch (err) {
    return next(err);
  }
};
