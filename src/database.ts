import { Pool } from 'pg';
import appConfig from './appConfig';

const database = new Pool({
  user: appConfig.db.user,
  host: appConfig.db.host,
  port: appConfig.db.port,
  password: appConfig.db.password,
  database: appConfig.db.dbName,
});

export default database;
