import { Router } from 'express';
import {
  login,
  register,
  logout,
  refreshAccessToken,
  getCurrentUser,
} from '../controllers/auth';
import { loginValidator, registerValidator } from '../middlewares/validators';
import auth from '../middlewares/auth';

const authRouter = Router();

authRouter.post('/login', loginValidator, login);
authRouter.post('/register', registerValidator, register);
authRouter.get('/token', refreshAccessToken);
authRouter.get('/logout', logout);
authRouter.get('/user', auth, getCurrentUser);

export default authRouter;
