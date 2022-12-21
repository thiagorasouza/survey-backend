import { badRequest } from "./components/bad-request";
import { notFound } from "./components/not-found";
import { serverError } from "./components/server-error";
import { unauthorized } from "./components/unauthorized";
import { loginPath } from "./paths/login-path";
import { accountSchema } from "./schemas/account-schema";
import { errorSchema } from "./schemas/error-schema";
import { loginParamsSchema } from "./schemas/login-params-schema";

export default {
  openapi: "3.0.0",
  info: {
    title: "Survey Backend API",
    description: "API for the survey app backend",
    version: "1.5.1",
  },
  servers: [
    {
      url: "/api",
    },
  ],
  tags: [
    {
      name: "Login",
    },
  ],
  paths: {
    "/login": loginPath,
  },
  components: {
    badRequest: badRequest,
    serverError: serverError,
    unauthorized: unauthorized,
    notFound: notFound,
  },
  schemas: {
    error: errorSchema,
    account: accountSchema,
    loginParams: loginParamsSchema,
  },
};
