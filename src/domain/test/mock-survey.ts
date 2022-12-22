import { SurveyModel } from "../models/survey";
import { AddSurvey, AddSurveyParams } from "../usecases/survey/add-survey";
import { LoadSurveyById } from "../usecases/survey/load-survey-by-id";
import { LoadSurveys } from "../usecases/survey/load-surveys";

export const mockSurveyModel = (): SurveyModel => ({
  id: "any_id",
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
    },
    { answer: "other_answer" },
    { answer: "another_answer" },
  ],
  date: new Date(),
});

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
    },
    { answer: "other_answer" },
  ],
  date: new Date(),
});

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(): Promise<void> {
      return;
    }
  }

  return new AddSurveyStub();
};

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(): Promise<SurveyModel> {
      return mockSurveyModel();
    }
  }

  return new LoadSurveyByIdStub();
};

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return mockSurveyModelList();
    }
  }

  return new LoadSurveysStub();
};

export const mockSurveyModelList = (): SurveyModel[] => {
  return [
    {
      id: "any_id",
      question: "any_question",
      answers: [
        {
          image: "any_image",
          answer: "any_answer",
        },
      ],
      date: new Date(),
    },
  ];
};
