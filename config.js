require("dotenv").config();

module.exports = {
  development: {
    username: process.env.NODE_APP_DATABASE_USERNAME,
    password: process.env.NODE_APP_DATABASE_PASSWORD,
    database: process.env.NODE_APP_DATABASE_NAME,
    host: process.env.NODE_APP_DATABASE_HOST,
    port: process.env.NODE_APP_DATABASE_PORT,
    dialect: process.env.NODE_APP_DATABASE_DIALECT,
  },
  test: {
    username: process.env.NODE_APP_DATABASE_USERNAME,
    password: process.env.NODE_APP_DATABASE_PASSWORD,
    database: process.env.NODE_APP_DATABASE_NAME,
    host: process.env.NODE_APP_DATABASE_HOST,
    port: process.env.NODE_APP_DATABASE_PORT,
    dialect: process.env.NODE_APP_DATABASE_DIALECT,
  },
  production: {
    username: process.env.NODE_APP_DATABASE_USERNAME,
    password: process.env.NODE_APP_DATABASE_PASSWORD,
    database: process.env.NODE_APP_DATABASE_NAME,
    host: process.env.NODE_APP_DATABASE_HOST,
    port: process.env.NODE_APP_DATABASE_PORT,
    dialect: process.env.NODE_APP_DATABASE_DIALECT,
  },
};
