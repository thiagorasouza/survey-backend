import { LoadSurveyResultController } from "../../../../../presentation/controllers/survey-result/load-survey-result/load-survey-result-controller";
import { Controller } from "../../../../../presentation/protocols";
import { makeLogControllerDecorator } from "../../../decorators/log-controller-decorator-factory";
import { makeDbLoadSurveyResult } from "../../../usecases/survey-result/load-survey-result/db-load-survey-result-factory";
import { makeDbLoadSurveyById } from "../../../usecases/survey/load-survey-by-id/db-load-survey-by-id-factory";

export const makeLoadSurveyResultController = (): Controller => {
  const loadSurveyById = makeDbLoadSurveyById();
  const loadSurveyResult = makeDbLoadSurveyResult();
  const loadSurveysController = new LoadSurveyResultController(
    loadSurveyById,
    loadSurveyResult
  );
  return makeLogControllerDecorator(loadSurveysController);
};
