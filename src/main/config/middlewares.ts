import { Express } from "express";
import { Server } from "http";
import {
  bodyParser,
  contentType,
  cors,
  getApolloMiddleware,
} from "../middlewares";

export default async (app: Express, server: Server): Promise<void> => {
  const apolloMiddleware = await getApolloMiddleware(server);
  app.use(bodyParser);
  app.use(cors);
  app.use("/graphql", apolloMiddleware);
  app.use(contentType);
};
