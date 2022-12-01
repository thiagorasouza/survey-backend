import { SurveyModel } from "../../../../domain/models/survey";
import { LoadSurveys } from "../../../../domain/usecases/load-surveys";
import { LoadSurveysController } from "./load-surveys-controller";
import MockDate from "mockdate";

interface SutTypes {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveys;
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveys();
  const sut = new LoadSurveysController(loadSurveysStub);

  return { sut, loadSurveysStub };
};

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return makeFakeSurveys();
    }
  }

  return new LoadSurveysStub();
};

const makeFakeSurveys = (): SurveyModel[] => {
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

describe("LoadSurveys Controller", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should call LoadSurveys", () => {
    const { sut, loadSurveysStub } = makeSut();

    const loadSpy = jest.spyOn(loadSurveysStub, "load");

    sut.handle({});

    expect(loadSpy).toHaveBeenCalledTimes(1);
  });
});
