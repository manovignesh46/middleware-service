import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { Device } from 'src/infrastructure/entities/device.entity';
import { CognitoDetail } from 'src/infrastructure/entities/cognito-detail.entity';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  schema: process.env.DB_SCHEMA,
  logging: Boolean(process.env.TYPEORM_LOGGING),
  // entities: [process.env.TYPEORM_ENTITIES],
  entities: [Device, CognitoDetail],
  migrations: [process.env.TYPEORM_MIGRATIONS],
  synchronize: true,
};
const datasource = new DataSource(dataSourceOptions);
export default datasource;
