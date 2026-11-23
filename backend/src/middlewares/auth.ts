import '../types';
import { NextFunction, Request, Response } from 'express';
import UnauthorizedError from '../errors/unauthorized-error';
import { verifyToken } from '../utils/jwt';

const BEARER_PREFIX = 'Bearer ';

const auth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith(BEARER_PREFIX)) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = header.slice(BEARER_PREFIX.length).trim();

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return next(new UnauthorizedError('Access-токен просрочен или невалиден'));
  }

  if (
    !payload
    || typeof payload !== 'object'
    || typeof (payload as { _id?: unknown })._id !== 'string'
  ) {
    return next(new UnauthorizedError('Access-токен просрочен или невалиден'));
  }

  req.user = payload;
  return next();
};

export default auth;
