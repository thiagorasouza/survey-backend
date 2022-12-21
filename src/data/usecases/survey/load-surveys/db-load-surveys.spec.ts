import {
  SurveyModel,
  LoadSurveysRepository,
} from "./db-load-surveys-protocols";
import { DbLoadSurveys } from "./db-load-surveys";
import MockDate from "mockdate";
import { mockLoadSurveysRepository } from "../../../test";
import { mockSurveyModelList } from "../../../../domain/test";

interface SutTypes {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepository;
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);

  return { sut, loadSurveysRepositoryStub };
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

    expect(surveys).toEqual(mockSurveyModelList());
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
