import { DbSaveSurveyResult } from "../../../data/usecases/db-save-survey-result";
import { SaveSurveyResult } from "../../../domain/usecases/save-survey-result";
import { SurveyResultMongoRepository } from "../../../infra/db/mongodb/survey-result-mongo-repository";

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const repository = new SurveyResultMongoRepository();
  return new DbSaveSurveyResult(repository);
};
