import http from "node:http";
import express from "express";

import env from "./config/env";
import setupMiddlewares from "./config/middlewares";
import setupSwagger from "./config/swagger";
import setupRoutes from "./config/routes";
import setupStaticFiles from "./config/static-files";

import { MongoHelper } from "../infra/db/mongodb/mongo-helper";

const app = express();
const server = http.createServer(app);

async function startServer() {
  setupStaticFiles(app);
  setupSwagger(app);
  await setupMiddlewares(app, server);
  setupRoutes(app);

  await MongoHelper.connect(env.mongoUrl);

  server.listen(env.port, () => console.log(`Sever running on ${env.port}`));
}

startServer();
