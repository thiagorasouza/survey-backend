import { Express, Router } from "express";
import setupLoginRoutes from "../routes/login-routes";
import setupSurveyResultRoutes from "../routes/survey-result-routes";
import setupSurveyRoutes from "../routes/survey-routes";

export default (app: Express): void => {
  const router = Router();
  app.use("/api", router);

  setupLoginRoutes(router);
  setupSurveyResultRoutes(router);
  setupSurveyRoutes(router);
};
