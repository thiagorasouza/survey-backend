import { SurveyModel } from "../../../../domain/models/survey";
import { SurveyResultModel } from "../../../../domain/models/survey-result";

export interface LoadSurveysRepository {
  loadAll(): Promise<SurveyModel[]>;
}
