import http from "node:http";
import express from "express";
import setupMiddlewares from "./middlewares";
import setupSwagger from "./swagger";
import setupRoutes from "./routes";
import setupStaticFiles from "./static-files";

export const setupServer = async () => {
  const app = express();
  const server = http.createServer(app);

  setupStaticFiles(app);
  setupSwagger(app);
  await setupMiddlewares(app, server);
  setupRoutes(app);

  return { app, server };
};
