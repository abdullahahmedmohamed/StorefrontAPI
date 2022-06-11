import express from 'express';
import { StatusCode } from '../../constants';
import authorize from '../../middlewares/authorizeMiddleware';
import { ProductToSave } from '../../model/products/ProductStore';
import productService from '../../services/products/productService';
import { RouteHandlerAsync } from '../../types/route-handler';

import catchError from '../../utilities/catchRouteError';

const productRoutes = express.Router();

const index: RouteHandlerAsync = async (_req, res) => {
  const result = await productService.index();
  res.json(result);
};

const show: RouteHandlerAsync = async (req, res) => {
  const result = await productService.show(parseInt(req.params.id));
  res.json(result);
};

const create: RouteHandlerAsync = async (req, res) => {
  const response = await productService.create(req.body as ProductToSave);
  res.status(StatusCode.Created).json(response);
};

const update: RouteHandlerAsync = async (req, res) => {
  await productService.update(parseInt(req.params.id), req.body as ProductToSave);
  res.sendStatus(StatusCode.OK);
};
const remove: RouteHandlerAsync = async (req, res) => {
  await productService.delete(parseInt(req.params.id));
  res.sendStatus(StatusCode.OK);
};

productRoutes.get('/products', catchError(index));
productRoutes.get('/products/:id([0-9]+)', catchError(show));
productRoutes.post('/products', authorize, catchError(create));
productRoutes.put('/products/:id([0-9]+)', authorize, catchError(update));
productRoutes.delete('/products/:id([0-9]+)', authorize, catchError(remove));

export default productRoutes;
