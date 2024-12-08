import { DataSourceOptions } from 'typeorm';
import { getConfig } from './index';

export const ormConfig: DataSourceOptions = {
  type: "mysql",
  host: getConfig("/db/host"),
  port: getConfig("/db/port"),
  username: getConfig("/db/username"),
  password: getConfig("/db/password"),
  database: getConfig("/db/database"),
  synchronize: true,
  logging: true,
};
