import jwt from "jsonwebtoken";

export interface UserPayload {
  _id: string;
}

const { JWT_SECRET = "dev-secret" } = process.env;

// Пейлоад — строго { _id }, как требует ТЗ
export const signAccessToken = (payload: UserPayload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "10m" });

export const signRefreshToken = (payload: UserPayload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

export const verifyToken = (token: string): UserPayload =>
  jwt.verify(token, JWT_SECRET) as UserPayload;

export default JWT_SECRET;
