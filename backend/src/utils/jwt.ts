import jwt from 'jsonwebtoken';
import {
  JWT_SECRET,
  AUTH_ACCESS_TOKEN_EXPIRY,
  AUTH_REFRESH_TOKEN_EXPIRY,
} from '../config';

export interface UserPayload {
  _id: string;
}

export const signAccessToken = (payload: UserPayload) => jwt.sign(payload, JWT_SECRET, {
  expiresIn: AUTH_ACCESS_TOKEN_EXPIRY,
});

export const signRefreshToken = (payload: UserPayload) => jwt.sign(payload, JWT_SECRET, {
  expiresIn: AUTH_REFRESH_TOKEN_EXPIRY,
});

export function verifyToken(token: string): UserPayload | null {
  return jwt.verify(token, JWT_SECRET) as UserPayload;
}
