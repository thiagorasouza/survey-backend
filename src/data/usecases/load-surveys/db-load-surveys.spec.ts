import {
  SurveyModel,
  LoadSurveysRepository,
} from "./db-load-surveys-protocols";
import { DbLoadSurveys } from "./db-load-surveys";
import MockDate from "mockdate";

interface SutTypes {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepository;
}

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return makeFakeSurveys();
    }
  }

  return new LoadSurveysRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);

  return { sut, loadSurveysRepositoryStub };
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

describe("DbLoadSurveys", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should call LoadSurveysRepository", async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();

    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, "loadAll");

    await sut.load();

    expect(loadAllSpy).toHaveBeenCalledTimes(1);
  });

  it("should return a list of surveys on success", async () => {
    const { sut } = makeSut();

    const surveys = await sut.load();

    expect(surveys).toEqual(makeFakeSurveys());
  });

  it("should throw if LoadSurveysRepository throws", async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveysRepositoryStub, "loadAll")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.load();

    expect(promise).rejects.toThrow();
  });
});
