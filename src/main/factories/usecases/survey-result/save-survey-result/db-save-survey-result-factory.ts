import { DbSaveSurveyResult } from "../../../../../data/usecases/survey-result/save-survey-result/db-save-survey-result";
import { SaveSurveyResult } from "../../../../../domain/usecases/survey-result/save-survey-result";
import { SurveyResultMongoRepository } from "../../../../../infra/db/mongodb/survey-result/survey-result-mongo-repository";

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const repository = new SurveyResultMongoRepository();
  return new DbSaveSurveyResult(repository, repository);
};
