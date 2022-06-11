import app from '../../app';
import supertest from 'supertest';

export const testServer = supertest(app);
