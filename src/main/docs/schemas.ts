import { accountSchema } from "./schemas/account-schema";
import { addSurveyParamsSchema } from "./schemas/add-survey-schema";
import { errorSchema } from "./schemas/error-schema";
import { loginParamsSchema } from "./schemas/login-params-schema";
import { saveSurveyResultParamsSchema } from "./schemas/save-survey-result-schema";
import { signupParamsSchema } from "./schemas/signup-params-schema";
import { surveyAnswerSchema } from "./schemas/survey-answer-schema";
import { surveyResultAnswerSchema } from "./schemas/survey-result-answer-schema";
import { surveyResultSchema } from "./schemas/survey-result-schema";
import { surveySchema } from "./schemas/survey-schema";
import { surveysSchema } from "./schemas/surveys-schema";

export const schemas = {
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
  surveyResultAnswer: surveyResultAnswerSchema,
};
