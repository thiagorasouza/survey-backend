import { SurveyModel } from "../models/survey";

export type AddSurveyRequestModel = Omit<SurveyModel, "id">;

export type AddSurveyResponseModel = void;

export interface AddSurvey {
  add(data: AddSurveyRequestModel): Promise<AddSurveyResponseModel>;
}
