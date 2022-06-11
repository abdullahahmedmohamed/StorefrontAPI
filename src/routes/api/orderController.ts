import express from 'express';
import { StatusCode } from '../../constants';
import authorize from '../../middlewares/authorizeMiddleware';
import orderService from '../../services/orders/orderService';
import { RouteHandlerAsync } from '../../types/route-handler';
import catchError from '../../utilities/catchRouteError';

const orderRoutes = express.Router();

const index: RouteHandlerAsync = async (_req, res) => {
  const result = await orderService.index();
  res.json(result);
};

const show: RouteHandlerAsync = async (req, res) => {
  const result = await orderService.show(parseInt(req.params.id));
  res.json(result);
};

const create: RouteHandlerAsync = async (req, res) => {
  const response = await orderService.create({ ...req.body, userId: req.user!.id });
  res.status(StatusCode.Created).json(response);
};

const update: RouteHandlerAsync = async (req, res) => {
  await orderService.update(parseInt(req.params.id), {
    userId: req.user!.id,
    status: req.body.status,
    products: req.body.products,
  });
  res.sendStatus(StatusCode.OK);
};

const remove: RouteHandlerAsync = async (req, res) => {
  await orderService.delete(parseInt(req.params.id));
  res.sendStatus(StatusCode.OK);
};

orderRoutes.use(authorize);
orderRoutes.get('/orders', catchError(index));
orderRoutes.get('/orders/:id([0-9]+)', catchError(show));
orderRoutes.post('/orders', catchError(create));
orderRoutes.put('/orders/:id([0-9]+)', catchError(update));
orderRoutes.delete('/orders/:id([0-9]+)', catchError(remove));

export default orderRoutes;
