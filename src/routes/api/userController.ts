import express from 'express';
import { StatusCode } from '../../constants';
import authorize from '../../middlewares/authorizeMiddleware';
import userService from '../../services/users/userService';
import { RouteHandlerAsync } from '../../types/route-handler';

import catchError from '../../utilities/catchRouteError';

const userRoutes = express.Router();

const index: RouteHandlerAsync = async (_req, res) => {
  const result = await userService.index();
  res.json(result);
};

const show: RouteHandlerAsync = async (req, res) => {
  const result = await userService.show(parseInt(req.params.id));
  res.json(result);
};

const register: RouteHandlerAsync = async (req, res) => {
  const response = await userService.register(req.body as CreateUserDto);
  res.status(StatusCode.Created).json(response);
};

const login: RouteHandlerAsync = async (req, res) => {
  const response = await userService.login(req.body as LoginCredentials);
  res.json(response);
};

userRoutes.get('/users', authorize, catchError(index));
userRoutes.get('/users/:id([0-9]+)', authorize, catchError(show));
userRoutes.post('/users/register', catchError(register));
userRoutes.post('/users/login', catchError(login));

export default userRoutes;
