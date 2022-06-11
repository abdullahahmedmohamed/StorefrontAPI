import express from 'express';
import orderRoutes from './api/orderController';
import productRoutes from './api/productController';
import userRoutes from './api/userController';

export default function registerRoutes(app: express.Express) {
  const router = express.Router();
  router.use(userRoutes);
  router.use(productRoutes);
  router.use(orderRoutes);
  app.use('/api', router);
}
