import { DbLoadSurveys } from "../../../../../data/usecases/survey/load-surveys/db-load-surveys";
import { LoadSurveys } from "../../../../../domain/usecases/survey/load-surveys";
import { SurveyResultMongoRepository } from "../../../../../infra/db/mongodb/survey-result/survey-result-mongo-repository";
import { SurveyMongoRepository } from "../../../../../infra/db/mongodb/survey/survey-mongo-repository";

export const makeDbLoadSurveys = (): LoadSurveys => {
  const surveysRepository = new SurveyMongoRepository();
  const surveyResultsRepository = new SurveyResultMongoRepository();
  return new DbLoadSurveys(surveysRepository, surveyResultsRepository);
};
