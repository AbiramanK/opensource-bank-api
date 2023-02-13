import * as dotenv from "dotenv";
dotenv.config();
import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize(
  process.env.NODE_APP_DATABASE_NAME!,
  process.env.NODE_APP_DATABASE_USERNAME!,
  process.env.NODE_APP_DATABASE_PASSWORD!,
  {
    host: process.env.NODE_APP_DATABASE_HOST,
    port: parseInt(process.env.NODE_APP_DATABASE_PORT!),
    dialect: process.env.NODE_APP_DATABASE_DIALECT! as Dialect,
  }
);

export { Sequelize, sequelize };
