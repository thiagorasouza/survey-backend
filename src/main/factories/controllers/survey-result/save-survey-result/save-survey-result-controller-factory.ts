import { SaveSurveyResultController } from "../../../../../presentation/controllers/survey-result/save-survey-result/save-survey-result-controller";
import { Controller } from "../../../../../presentation/protocols";
import { makeLogControllerDecorator } from "../../../decorators/log-controller-decorator-factory";
import { makeDbLoadSurveyResult } from "../../../usecases/survey-result/load-survey-result/db-load-survey-result-factory";
import { makeDbSaveSurveyResult } from "../../../usecases/survey-result/save-survey-result/db-save-survey-result-factory";
import { makeDbLoadSurveyById } from "../../../usecases/survey/load-survey-by-id/db-load-survey-by-id-factory";

export const makeSaveSurveyResultController = (): Controller => {
  const loadSurveyById = makeDbLoadSurveyById();
  const saveSurveyResult = makeDbSaveSurveyResult();
  const loadSurveyResult = makeDbLoadSurveyResult();
  const loadSurveysController = new SaveSurveyResultController(
    loadSurveyById,
    saveSurveyResult,
    loadSurveyResult
  );
  return makeLogControllerDecorator(loadSurveysController);
};
