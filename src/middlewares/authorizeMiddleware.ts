import express from 'express';
import { StatusCode } from '../constants';
import userService from '../services/users/userService';

const authorize = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    res.sendStatus(StatusCode.UnAuthorized);
    return;
  }

  try {
    req.user = await userService.validateToken(token);
    next();
  } catch (error) {
    next(error);
  }
};

export default authorize;
