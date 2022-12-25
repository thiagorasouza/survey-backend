import { SurveyModel } from "../models/survey";

export interface LoadSurveyByIdRequestModel {
  id: string;
}

export type LoadSurveyByIdResponseModel = SurveyModel;

export interface LoadSurveyById {
  loadById(
    requestModel: LoadSurveyByIdRequestModel
  ): Promise<LoadSurveyByIdResponseModel>;
}
