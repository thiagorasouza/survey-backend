import { loginPath } from "./paths/login-path";
import { signupPath } from "./paths/signup-path";
import { surveyResultPath } from "./paths/survey-result-path";
import { surveysPath } from "./paths/surveys-path";

export const paths = {
  "/login": loginPath,
  "/surveys": surveysPath,
  "/signup": signupPath,
  "/surveys/{surveyId}/result": surveyResultPath,
};
