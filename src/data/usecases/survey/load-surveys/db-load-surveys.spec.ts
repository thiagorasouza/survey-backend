import { LoadSurveysRepository } from "./db-load-surveys-protocols";
import { DbLoadSurveys } from "./db-load-surveys";
import MockDate from "mockdate";
import {
  mockLoadByAccountIdRepository,
  mockLoadSurveysRepository,
} from "../../../test";
import { LoadByAccountIdRepository } from "../../../protocols/db/survey-result/load-by-account-id-repository";
import { mockSurveyModelListWithFlag } from "../../../../domain/test";

interface SutTypes {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepository;
  loadByAccountIdRepositoryStub: LoadByAccountIdRepository;
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository();
  const loadByAccountIdRepositoryStub = mockLoadByAccountIdRepository();
  const sut = new DbLoadSurveys(
    loadSurveysRepositoryStub,
    loadByAccountIdRepositoryStub
  );

  return { sut, loadSurveysRepositoryStub, loadByAccountIdRepositoryStub };
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

    await sut.load("any_account_id");

    expect(loadAllSpy).toHaveBeenCalledTimes(1);
  });

  it("should throw if LoadSurveysRepository throws", async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveysRepositoryStub, "loadAll")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.load("any_account_id");

    expect(promise).rejects.toThrow();
  });

  it("should call LoadByAccountIdRepository with correct value", async () => {
    const { sut, loadByAccountIdRepositoryStub } = makeSut();

    const loadByAccountIdSpy = jest.spyOn(
      loadByAccountIdRepositoryStub,
      "loadByAccountId"
    );

    await sut.load("any_account_id");

    expect(loadByAccountIdSpy).toHaveBeenCalledTimes(1);
    expect(loadByAccountIdSpy).toHaveBeenCalledWith("any_account_id");
  });

  it("should throw if LoadByAccountIdRepository throws", async () => {
    const { sut, loadByAccountIdRepositoryStub } = makeSut();

    jest
      .spyOn(loadByAccountIdRepositoryStub, "loadByAccountId")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.load("any_account_id");

    expect(promise).rejects.toThrow();
  });

  it("should return a compiled list of surveys on success", async () => {
    const { sut } = makeSut();

    const surveys = await sut.load("any_account_id");

    expect(surveys).toEqual(mockSurveyModelListWithFlag());
  });
});
