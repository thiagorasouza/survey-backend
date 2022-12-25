import { SurveyModel } from "../models/survey";

export interface LoadSurveysRequestModel {
  accountId: string;
}

export type LoadSurveysResponseModel = SurveyModel[];

export interface LoadSurveys {
  load(
    requestModel: LoadSurveysRequestModel
  ): Promise<LoadSurveysResponseModel>;
}
