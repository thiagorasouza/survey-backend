import { DbLoadSurveyResult } from "../../../data/usecases/db-load-survey-result";
import { LoadSurveyResult } from "../../../domain/usecases/load-survey-result";
import { SurveyResultMongoRepository } from "../../../infra/db/mongodb/survey-result-mongo-repository";
import { SurveyMongoRepository } from "../../../infra/db/mongodb/survey-mongo-repository";

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  const surveysRepository = new SurveyMongoRepository();
  const surveyResultsRepository = new SurveyResultMongoRepository();
  return new DbLoadSurveyResult(surveysRepository, surveyResultsRepository);
};
