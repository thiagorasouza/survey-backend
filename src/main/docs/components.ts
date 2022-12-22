import { badRequest } from "./components/bad-request";
import { forbidden } from "./components/forbidden";
import { notFound } from "./components/not-found";
import { serverError } from "./components/server-error";
import { unauthorized } from "./components/unauthorized";
import { apiKeyAuthSchema } from "./schemas/api-key-auth-schema";

export const components = {
  badRequest: badRequest,
  serverError: serverError,
  unauthorized: unauthorized,
  notFound: notFound,
  forbidden: forbidden,
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema,
  },
};
