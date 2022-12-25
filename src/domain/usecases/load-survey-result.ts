import { SurveyCompiledModel } from "../models/survey-result";

export interface LoadSurveyResultRequestModel {
  surveyId: string;
  accountId: string;
}

export type LoadSurveyResultResponseModel = SurveyCompiledModel;

export interface LoadSurveyResult {
  load(
    requestModel: LoadSurveyResultRequestModel
  ): Promise<LoadSurveyResultResponseModel>;
}
