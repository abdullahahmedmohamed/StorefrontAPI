import { ProductToSave } from '../model/products/ProductStore';
import userGenerator from './utils/userGenerator';
import { StatusCode } from '../constants';
import { testServer as server } from './utils/testServer';

describe('Products Endpoints', () => {
  let id: number;
  const product: ProductToSave = {
    name: 'apiEndPointp101',
    price: 2422,
  };
  const routePath = '/api/products';
  let bearerToken: string;
  beforeAll(async () => {
    bearerToken = (await userGenerator.getAuthenticatedUser()).bearerToken;
  });

  describe('[create] endpoint', () => {
    it('Should create new product', async () => {
      const res = await server
        .post(routePath)
        .send({ ...product })
        .set('Authorization', bearerToken);
      id = parseInt(res.body.id);
      expect(res.statusCode).toBe(StatusCode.Created);
      expect(id).toBeGreaterThan(0);
    });

    it('Should respond with UnAuthorized when token not appended', async () => {
      const res = await server.post(routePath).send({ ...product });
      expect(res.statusCode).toBe(StatusCode.UnAuthorized);
    });

    it('Should respond with BadRequest when validation fail', async () => {
      const res = await server.post(routePath).send({}).set('Authorization', bearerToken);
      expect(res.statusCode).toBe(StatusCode.BadRequest);
    });
  });

  describe('[show] endpoint', () => {
    it('Should return product by id', async () => {
      const res = await server.get(`${routePath}/${id}`);
      expect(res.statusCode).toBe(StatusCode.OK);
      expect(res.body.id).toEqual(id);
    });

    it('Should return NotFound  if product id not exists', async () => {
      const res = await server.get(`${routePath}/${id + 24124}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('[update] endpoint', () => {
    it('Should update product successfuly', async () => {
      const res = await server
        .put(`${routePath}/${id}`)
        .send({ name: 'asfasfasf', price: 232 } as ProductToSave)
        .set('Authorization', bearerToken);
      expect(res.statusCode).toBe(StatusCode.OK);
    });

    it('Should respond with UnAuthorized when token not appended', async () => {
      const res = await server.put(`${routePath}/${id}`).send({ name: 'asfasfasf', price: 232 } as ProductToSave);
      expect(res.statusCode).toBe(StatusCode.UnAuthorized);
    });

    it('Should respond with BadRequest when validation fail', async () => {
      const res = await server.put(`${routePath}/${id}`).send({}).set('Authorization', bearerToken);
      expect(res.statusCode).toBe(StatusCode.BadRequest);
    });
  });

  it('[Index] Should get all products', async () => {
    const res = await server.get(routePath);
    expect(res.statusCode).toBe(StatusCode.OK);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('[remove] Should remove product by id', async () => {
    const res = await server.delete(`${routePath}/${id}`).set('Authorization', bearerToken);
    expect(res.statusCode).toBe(StatusCode.OK);
  });
});
