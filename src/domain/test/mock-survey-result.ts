import {
  SurveyCompiledModel,
  SurveyResultModel,
} from "../models/survey-result";
import { LoadSurveyResult } from "../usecases/survey-result/load-survey-result";
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

export const mockSurveyResultModelList = (): SurveyResultModel[] => [
  {
    id: "any_id",
    accountId: "any_account_id",
    surveyId: "any_survey_id",
    answer: "any_answer",
    date: new Date(),
  },
  {
    id: "any_id",
    accountId: "any_account_id",
    surveyId: "any_survey_id",
    answer: "other_answer",
    date: new Date(),
  },
];

export const mockSurveyCompiledModel = (): SurveyCompiledModel => ({
  surveyId: "any_id",
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
      count: 1,
      percent: 50,
    },
    {
      answer: "other_answer",
      count: 1,
      percent: 50,
    },
    {
      answer: "another_answer",
      count: 0,
      percent: 0,
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

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load(): Promise<SurveyCompiledModel> {
      return mockSurveyCompiledModel();
    }
  }

  return new LoadSurveyResultStub();
};
