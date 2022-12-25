import { LoadSurveysController } from "../../../presentation/controllers/load-surveys-controller";
import { Controller } from "../../../presentation/protocols";
import { makeLogControllerDecorator } from "../decorators";
import { makeDbLoadSurveys } from "../usecases";

export const makeLoadSurveysController = (): Controller => {
  const loadSurveysController = new LoadSurveysController(makeDbLoadSurveys());
  return makeLogControllerDecorator(loadSurveysController);
};
