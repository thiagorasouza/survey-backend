import { SurveyResultModel } from "../models/survey-result";
import {
  SaveSurveyResult,
  SaveSurveyResultParams,
} from "../usecases/survey-result/save-survey-result";

export const mockSurveyResultModel = (): SurveyResultModel => ({
  id: "any_id",
  accountId: "any_account_id",
  surveyId: "any_survey_id",
  answer: "any_answer",
  date: new Date(),
});

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => {
  const { id, ...rest } = mockSurveyResultModel();
  return rest;
};

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(): Promise<SurveyResultModel> {
      return mockSurveyResultModel();
    }
  }

  return new SaveSurveyResultStub();
};
