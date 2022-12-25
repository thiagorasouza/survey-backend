import { SurveyResultModel } from "../../../../domain/models/survey-result";
import { SaveSurveyResultRequestModel } from "../../../../domain/usecases/save-survey-result";

export interface SaveSurveyResultRepository {
  save(data: SaveSurveyResultRequestModel): Promise<SurveyResultModel>;
  loadBySurveyId(surveyId: string): Promise<SurveyResultModel[]>;
}
