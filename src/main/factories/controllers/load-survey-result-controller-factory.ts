import { LoadSurveyResultController } from "../../../presentation/controllers/load-survey-result-controller";
import { Controller } from "../../../presentation/protocols";
import { makeLogControllerDecorator } from "../decorators";
import { makeDbLoadSurveyById, makeDbLoadSurveyResult } from "../usecases";

export const makeLoadSurveyResultController = (): Controller => {
  const loadSurveyById = makeDbLoadSurveyById();
  const loadSurveyResult = makeDbLoadSurveyResult();
  const loadSurveysController = new LoadSurveyResultController(
    loadSurveyById,
    loadSurveyResult
  );
  return makeLogControllerDecorator(loadSurveysController);
};
