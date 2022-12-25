import { AddSurveyRequestModel } from "../../../../domain/usecases/add-survey";

export interface AddSurveyRepository {
  add(surveyData: AddSurveyRequestModel): Promise<void>;
}
