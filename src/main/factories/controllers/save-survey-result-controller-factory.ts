import { SaveSurveyResultController } from "../../../presentation/controllers/save-survey-result-controller";
import { Controller } from "../../../presentation/protocols";
import { makeLogControllerDecorator } from "../decorators";
import {
  makeDbLoadSurveyById,
  makeDbLoadSurveyResult,
  makeDbSaveSurveyResult,
} from "../usecases";

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
