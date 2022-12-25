import {
  SurveyResultModel,
  SurveyCompiledModel,
} from "../../../src/domain/models";
import {
  SaveSurveyResultRequestModel,
  SaveSurveyResult,
  LoadSurveyResult,
  SaveSurveyResultResponseModel,
} from "../../../src/domain/usecases";

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
    id: "other_id",
    accountId: "any_account_id",
    surveyId: "other_survey_id",
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
      isCurrentAccountAnswer: true,
    },
    {
      answer: "other_answer",
      count: 1,
      percent: 50,
      isCurrentAccountAnswer: false,
    },
    {
      answer: "another_answer",
      count: 0,
      percent: 0,
      isCurrentAccountAnswer: false,
    },
  ],
  date: new Date(),
});

export const mockSaveSurveyResultParams = (): SaveSurveyResultRequestModel => ({
  surveyId: "any_survey_id",
  accountId: "any_account_id",
  answer: "any_answer",
  date: new Date(),
});

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(): Promise<SaveSurveyResultResponseModel> {
      return mockSurveyResultModel();
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
