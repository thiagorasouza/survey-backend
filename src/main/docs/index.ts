import { badRequest } from "./components/bad-request";
import { forbidden } from "./components/forbidden";
import { notFound } from "./components/not-found";
import { serverError } from "./components/server-error";
import { unauthorized } from "./components/unauthorized";
import { loginPath } from "./paths/login-path";
import { signupPath } from "./paths/signup-path";
import { surveyResultPath } from "./paths/survey-result-path";
import { surveysPath } from "./paths/surveys-path";
import { accountSchema } from "./schemas/account-schema";
import { addSurveyParamsSchema } from "./schemas/add-survey-schema";
import { apiKeyAuthSchema } from "./schemas/api-key-auth-schema";
import { errorSchema } from "./schemas/error-schema";
import { loginParamsSchema } from "./schemas/login-params-schema";
import { saveSurveyResultParamsSchema } from "./schemas/save-survey-result-schema";
import { signupParamsSchema } from "./schemas/signup-params-schema";
import { surveyAnswerSchema } from "./schemas/survey-answer-schema";
import { surveyResultSchema } from "./schemas/survey-result-schema";
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
    "/signup": signupPath,
    "/surveys/{surveyId}/result": surveyResultPath,
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
    signupParams: signupParamsSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    surveyAnswer: surveyAnswerSchema,
    addSurveyParams: addSurveyParamsSchema,
    saveSurveyResultParams: saveSurveyResultParamsSchema,
    surveyResult: surveyResultSchema,
  },
};
