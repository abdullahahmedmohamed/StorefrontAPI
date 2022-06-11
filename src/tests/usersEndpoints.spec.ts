import userGenerator from './utils/userGenerator';
import { StatusCode } from '../constants';
import { testServer as server } from './utils/testServer';

describe('Users Endpoints', () => {
  let id: number;
  const user: CreateUserDto = {
    firstName: 'Endpoints',
    lastName: 'Endpoints LastName',
    userName: 'Endpoints',
    password: 'Endpoints',
  };
  const routePath = '/api/users';
  let bearerToken: string;
  beforeAll(async () => {
    bearerToken = (await userGenerator.getAuthenticatedUser()).bearerToken;
  });

  describe('[register] endpoint', () => {
    it('Should create new user', async () => {
      const res = await server.post(`${routePath}/register`).send({ ...user });
      id = parseInt(res.body.id);
      expect(res.statusCode).toBe(StatusCode.Created);
      expect(id).toBeGreaterThan(0);
      expect(res.body.token).toBeTruthy();
    });

    it('Should respond with BadRequest when validation fail', async () => {
      const res = await server.post(`${routePath}/register`).send({});
      expect(res.statusCode).toBe(StatusCode.BadRequest);
    });
  });

  describe('[login] endpoint', () => {
    it('Should Login with valid userName and password', async () => {
      const res = await server
        .post(`${routePath}/login`)
        .send({ userName: user.userName, password: user.password } as LoginCredentials);
      expect(res.statusCode).toBe(StatusCode.OK);
      expect(id).toBeGreaterThan(0);
      expect(res.body.token).toBeTruthy();
    });

    it('Should respond with BadRequest when validation fail', async () => {
      const res = await server.post(`${routePath}/login`).send({});
      expect(res.statusCode).toBe(StatusCode.BadRequest);
    });
  });

  describe('[show] endpoint', () => {
    it('Should return user by id', async () => {
      const res = await server.get(`${routePath}/${id}`).set('Authorization', bearerToken);
      expect(res.statusCode).toBe(StatusCode.OK);
      expect(res.body.id).toEqual(id);
    });

    it('Should return NotFound  if product id not exists', async () => {
      const res = await server.get(`${routePath}/${id + 2424}`).set('Authorization', bearerToken);
      expect(res.statusCode).toBe(404);
    });
  });

  it('[Index] Should get all users', async () => {
    const res = await server.get(routePath).set('Authorization', bearerToken);
    expect(res.statusCode).toBe(StatusCode.OK);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
