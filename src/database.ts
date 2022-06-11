import { Pool } from 'pg';

const dbName = process.env.NODE_ENV == 'test' ? process.env.Test_DB_Name : process.env.DB_NAME;

const database = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  password: process.env.DB_PASSWORD,
  database: dbName,
});

export default database;
