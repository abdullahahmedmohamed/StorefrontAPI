import app from '../app';
import { StatusCode } from '../constants';
import { testServer as server } from './utils/testServer';

describe('Test Api', () => {
  it('Should Application Instance Be Defined', () => {
    expect(app).toBeDefined();
  });

  it('Should response with [App Running] Message', async () => {
    const res = await server.get('/');
    expect(res.statusCode).toBe(StatusCode.OK);
    expect(res.text).toEqual('App Running');
  });
});
