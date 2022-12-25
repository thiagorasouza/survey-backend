import { DbLoadSurveys } from "../../../data/usecases/db-load-surveys";
import { LoadSurveys } from "../../../domain/usecases/load-surveys";
import { SurveyResultMongoRepository } from "../../../infra/db/mongodb/survey-result-mongo-repository";
import { SurveyMongoRepository } from "../../../infra/db/mongodb/survey-mongo-repository";

export const makeDbLoadSurveys = (): LoadSurveys => {
  const surveysRepository = new SurveyMongoRepository();
  const surveyResultsRepository = new SurveyResultMongoRepository();
  return new DbLoadSurveys(surveysRepository, surveyResultsRepository);
};
