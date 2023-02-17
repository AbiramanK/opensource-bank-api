import * as dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
// import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import cors from "cors";

import { sequelize } from "./dbconfig";
import { authChecker } from "./../middlewares/AuthMiddleware";

async function startServer() {
  const schema = await buildSchema({
    resolvers: [__dirname + "/../app/**/resolver.{ts,js}"],
    authChecker,
    emitSchemaFile: true,
  });

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const headers = req?.headers;
      if (headers?.authorization!) {
        const token = headers?.authorization!?.split(" ")![1] ?? "";
        const context = {
          token,
        };

        return context;
      }
    },
    cache: "bounded",
    csrfPrevention: true,
    persistedQueries: false,
    plugins: [
      // Install a landing page plugin based on NODE_ENV
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault({
            graphRef: "my-graph-id@my-graph-variant",
            footer: false,
          })
        : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ],
  });

  try {
    await sequelize.authenticate();
    console.log("✔✔ Databse Connection has been established successfully.");
  } catch (error) {
    console.error("❌❌ Database Unable to connect to the database:", error);
  }

  const PORT = parseInt(process.env.NODE_APP_SERVER_PORT!) ?? 8000;
  const HOST = process.env.NODE_APP_SERVER_HOST ?? "localhost";

  await server.start();

  const app = express();

  const corsOptions = {
    origin: "*",
  };

  app.use(cors(corsOptions));

  app.get("/", (req, res) => {
    res.sendStatus(200);
  });

  server.applyMiddleware({ app });

  var listener = app.listen({ host: HOST, port: PORT }, function () {
    console.log(listener?.address());
    console.info(`🚀  Server ready at http://${HOST}:${PORT}`);
  });

  // server.listen({ port: PORT }).then(({ url }) => {
  //   console.log(`🚀  Server ready at ${url}`);
  // });
}

startServer();
