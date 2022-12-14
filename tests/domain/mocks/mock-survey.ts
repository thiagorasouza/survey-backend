import { SurveyModel } from "../../../src/domain/models";
import {
  AddSurveyRequestModel,
  AddSurvey,
  LoadSurveyById,
  LoadSurveys,
  AddSurveyResponseModel,
} from "../../../src/domain/usecases";

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

export const mockAddSurveyParams = (): AddSurveyRequestModel => ({
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
    async add(): Promise<AddSurveyResponseModel> {
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
      id: "any_survey_id",
      question: "any_question",
      answers: [
        {
          image: "any_image",
          answer: "any_answer",
        },
      ],
      date: new Date(),
    },
    {
      id: "other_survey_id",
      question: "other_question",
      answers: [
        {
          image: "other_image",
          answer: "other_answer",
        },
      ],
      date: new Date(),
    },
    {
      id: "another_survey_id",
      question: "another_question",
      answers: [
        {
          image: "another_image",
          answer: "another_answer",
        },
      ],
      date: new Date(),
    },
  ];
};

export const mockSurveyModelListWithFlag = (): SurveyModel[] => [
  {
    id: "any_survey_id",
    question: "any_question",
    didAnswer: true,
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
    date: new Date(),
  },
  {
    id: "other_survey_id",
    question: "other_question",
    didAnswer: true,
    answers: [
      {
        image: "other_image",
        answer: "other_answer",
      },
    ],
    date: new Date(),
  },
  {
    id: "another_survey_id",
    question: "another_question",
    didAnswer: false,
    answers: [
      {
        image: "another_image",
        answer: "another_answer",
      },
    ],
    date: new Date(),
  },
];
