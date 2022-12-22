import { SurveyResultModel } from "../../../../domain/models/survey-result";

export interface LoadBySurveyIdRepository {
  loadBySurveyId(surveyId: string): Promise<SurveyResultModel[]>;
}
