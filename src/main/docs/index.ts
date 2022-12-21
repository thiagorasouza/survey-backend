import { badRequest } from "./components/bad-request";
import { forbidden } from "./components/forbidden";
import { notFound } from "./components/not-found";
import { serverError } from "./components/server-error";
import { unauthorized } from "./components/unauthorized";
import { loginPath } from "./paths/login-path";
import { surveysPath } from "./paths/surveys-path";
import { accountSchema } from "./schemas/account-schema";
import { apiKeyAuthSchema } from "./schemas/api-key-auth-schema";
import { errorSchema } from "./schemas/error-schema";
import { loginParamsSchema } from "./schemas/login-params-schema";
import { surveyAnswerSchema } from "./schemas/survey-answer-schema";
import { surveySchema } from "./schemas/survey-schema";
import { surveysSchema } from "./schemas/surveys-schema";

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
    {
      name: "Surveys",
    },
  ],
  paths: {
    "/login": loginPath,
    "/surveys": surveysPath,
  },
  components: {
    badRequest: badRequest,
    serverError: serverError,
    unauthorized: unauthorized,
    notFound: notFound,
    forbidden: forbidden,
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema,
    },
  },
  schemas: {
    error: errorSchema,
    account: accountSchema,
    loginParams: loginParamsSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    surveyAnswer: surveyAnswerSchema,
  },
};
