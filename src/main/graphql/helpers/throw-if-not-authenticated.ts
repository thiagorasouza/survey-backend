import { GraphQLError } from "graphql";

export const throwIfNotAuthenticated = (context: any) => {
  if (!context.authenticated) {
    throw new GraphQLError("Unauthorized", {
      extensions: {
        code: "FORBIDDEN",
      },
    });
  }
};
