import {
  SurveyCompiledModel,
  SurveyResultModel,
} from "../models/survey-result";
import {
  SaveSurveyResult,
  SaveSurveyResultParams,
} from "../usecases/survey-result/save-survey-result";
import { mockSurveyModel } from "./mock-survey";

export const mockSurveyResultModel = (): SurveyResultModel => ({
  id: "any_id",
  accountId: "any_account_id",
  surveyId: "any_survey_id",
  answer: "any_answer",
  date: new Date(),
});

export const mockSurveyCompiledModel = (): SurveyCompiledModel => ({
  surveyId: "any_id",
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
      count: 2,
      percent: 100,
    },
  ],
  date: new Date(),
});

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  survey: mockSurveyModel(),
  accountId: "any_account_id",
  answer: "any_answer",
  date: new Date(),
});

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(): Promise<SurveyCompiledModel> {
      return mockSurveyCompiledModel();
    }
  }

  return new SaveSurveyResultStub();
};
