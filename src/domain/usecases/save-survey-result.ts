import { SurveyResultModel } from "../models/survey-result";

export type SaveSurveyResultRequestModel = {
  surveyId: string;
  accountId: string;
  answer: string;
  date: Date;
};

export type SaveSurveyResultResponseModel = SurveyResultModel;

export interface SaveSurveyResult {
  save(
    data: SaveSurveyResultRequestModel
  ): Promise<SaveSurveyResultResponseModel>;
}
