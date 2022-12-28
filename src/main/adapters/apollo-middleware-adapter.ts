import { Middleware } from "../../presentation/protocols";

export const adaptAuthMiddleware = (middleware: Middleware) => {
  return async ({ req }) => {
    const authRequest = {
      accessToken: req.headers?.["x-access-token"],
    };

    const httpResponse = await middleware.handle(authRequest);

    if (httpResponse.statusCode === 200) {
      return {
        ...httpResponse,
        authenticated: true,
      };
    } else {
      return {
        authenticated: false,
      };
    }
  };
};
