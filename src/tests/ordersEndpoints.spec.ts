import userGenerator from './utils/userGenerator';
import { StatusCode } from '../constants';
import { testServer as server } from './utils/testServer';
import { OrderDto } from '../model/orders/OrderStore';
import productService from '../services/products/productService';

describe('Orders Endpoints', () => {
  const routePath = '/api/orders';
  let bearerToken: string;
  let orderId: number;
  let order: Omit<OrderDto, 'id'>;
  beforeAll(async () => {
    const p1 = await productService.create({ name: 'orderservice_test_1', price: 1 });
    const p2 = await productService.create({ name: 'orderservice_test_2', price: 2 });
    const p3 = await productService.create({ name: 'orderservice_test_3', price: 3 });
    const user = await userGenerator.getAuthenticatedUser();
    bearerToken = user.bearerToken;
    const products = [p1, p2, p3].map((p) => ({ productId: p.id, quantity: Math.ceil(Math.random() * 100) }));
    order = {
      userId: user.id,
      status: 'active',
      products,
    };
  });

  describe('[create] endpoint', () => {
    it('Should create new order', async () => {
      const res = await server
        .post(routePath)
        .send({ ...order })
        .set('Authorization', bearerToken);
      orderId = parseInt(res.body.id);
      expect(res.statusCode).toBe(StatusCode.Created);
      expect(orderId).toBeGreaterThan(0);
    });

    it('Should respond with UnAuthorized when token not appended', async () => {
      const res = await server.post(routePath).send({ ...order });
      expect(res.statusCode).toBe(StatusCode.UnAuthorized);
    });

    it('Should respond with BadRequest when validation fail', async () => {
      const res = await server.post(routePath).send({}).set('Authorization', bearerToken);
      expect(res.statusCode).toBe(StatusCode.BadRequest);
    });

    it('Should respond with BadRequest if one or more productsId is invalid or not exists', async () => {
      const input = { ...order };
      input.products = [...input.products, { productId: 334, quantity: 43 }];
      const res = await server.post(routePath).send(input).set('Authorization', bearerToken);
      expect(res.statusCode).toBe(StatusCode.BadRequest);
    });
  });

  describe('[show] endpoint', () => {
    it('Should return order by id', async () => {
      const res = await server.get(`${routePath}/${orderId}`).set('Authorization', bearerToken);
      expect(res.statusCode).toBe(StatusCode.OK);
      expect(res.body.id).toEqual(orderId);
    });

    it('Should return NotFound  if order id not exists', async () => {
      const res = await server.get(`${routePath}/${orderId + 24124}`).set('Authorization', bearerToken);
      expect(res.statusCode).toBe(404);
    });

    it('Should respond with UnAuthorized when token not appended', async () => {
      const res = await server.get(`${routePath}/${orderId}`);
      expect(res.statusCode).toBe(StatusCode.UnAuthorized);
    });
  });

  describe('[update] endpoint', () => {
    it('Should update order successfuly', async () => {
      const input = { ...order };
      input.status = 'complete';
      input.products = order.products.map((p) => ({ ...p, quantity: p.quantity + 5 }));

      const res = await server
        .put(`${routePath}/${orderId}`)
        .send({ ...input })
        .set('Authorization', bearerToken);
      expect(res.statusCode).toBe(StatusCode.OK);
    });

    it('Should respond with UnAuthorized when token not appended', async () => {
      const res = await server.put(`${routePath}/${orderId}`).send({ ...order });
      expect(res.statusCode).toBe(StatusCode.UnAuthorized);
    });

    it('Should respond with BadRequest when validation fail', async () => {
      const res = await server.put(`${routePath}/${orderId}`).send({}).set('Authorization', bearerToken);
      expect(res.statusCode).toBe(StatusCode.BadRequest);
    });

    it('Should respond with BadRequest if one or more productsId is invalid or not exists', async () => {
      const input = { ...order };
      input.products = [...input.products, { productId: 334, quantity: 43 }];
      const res = await server
        .put(`${routePath}/${orderId}`)
        .send({ ...input })
        .set('Authorization', bearerToken);
      expect(res.statusCode).toBe(StatusCode.BadRequest);
    });

    it('Should respond with BadRequest if orderId is invalid or not exists', async () => {
      const input = { ...order };

      const res = await server
        .put(`${routePath}/${343}`)
        .send({ ...input })
        .set('Authorization', bearerToken);
      expect(res.statusCode).toBe(StatusCode.BadRequest);
    });
  });

  describe('[Index] endpoint', () => {
    it('Should get all orders', async () => {
      const res = await server.get(routePath).set('Authorization', bearerToken);
      expect(res.statusCode).toBe(StatusCode.OK);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('Should respond with UnAuthorized when token not appended', async () => {
      const res = await server.get(routePath);
      expect(res.statusCode).toBe(StatusCode.UnAuthorized);
    });
  });

  describe('[remove] endpoint', () => {
    it('[remove] Should remove order by id', async () => {
      const res = await server.delete(`${routePath}/${orderId}`).set('Authorization', bearerToken);
      expect(res.statusCode).toBe(StatusCode.OK);
    });

    it('Should respond with UnAuthorized when token not appended', async () => {
      const res = await server.delete(`${routePath}/${orderId}`);
      expect(res.statusCode).toBe(StatusCode.UnAuthorized);
    });
  });
});
