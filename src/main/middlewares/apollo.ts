import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { Server } from "node:http";
import { typeDefs } from "../graphql/type-defs";
import { resolvers } from "../graphql/resolvers";
import { RequestHandler } from "express";
import { makeAuthMiddleware } from "../factories/middlewares";
import { adaptAuthMiddleware } from "../adapters/apollo-middleware-adapter";

export const getApolloMiddleware = async (
  httpServer: Server
): Promise<RequestHandler> => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await apolloServer.start();

  return expressMiddleware(apolloServer, {
    context: adaptAuthMiddleware(makeAuthMiddleware()),
  });
};
