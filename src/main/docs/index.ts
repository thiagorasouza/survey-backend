import { loginPath } from "./paths/login-path";
import { accountSchema } from "./schemas/account-schema";
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
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
  },
};
