import MockDate from "mockdate";
import {
  LoadSurveysRepository,
  LoadByAccountIdRepository,
} from "../../../src/data/protocols";
import { DbLoadSurveys } from "../../../src/data/usecases";
import { mockSurveyModelListWithFlag } from "../../domain/mocks";
import {
  mockLoadSurveysRepository,
  mockLoadByAccountIdRepository,
  mockLoadSurveysRequestModel,
} from "../mocks";

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

    const requestModel = mockLoadSurveysRequestModel();
    await sut.load(requestModel);

    expect(loadAllSpy).toHaveBeenCalledTimes(1);
  });

  it("should throw if LoadSurveysRepository throws", async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveysRepositoryStub, "loadAll")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const requestModel = mockLoadSurveysRequestModel();
    const promise = sut.load(requestModel);

    expect(promise).rejects.toThrow();
  });

  it("should call LoadByAccountIdRepository with correct value", async () => {
    const { sut, loadByAccountIdRepositoryStub } = makeSut();

    const loadByAccountIdSpy = jest.spyOn(
      loadByAccountIdRepositoryStub,
      "loadByAccountId"
    );

    const requestModel = mockLoadSurveysRequestModel();
    await sut.load(requestModel);

    expect(loadByAccountIdSpy).toHaveBeenCalledTimes(1);
    expect(loadByAccountIdSpy).toHaveBeenCalledWith(requestModel.accountId);
  });

  it("should throw if LoadByAccountIdRepository throws", async () => {
    const { sut, loadByAccountIdRepositoryStub } = makeSut();

    jest
      .spyOn(loadByAccountIdRepositoryStub, "loadByAccountId")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const requestModel = mockLoadSurveysRequestModel();
    const promise = sut.load(requestModel);

    expect(promise).rejects.toThrow();
  });

  it("should return a compiled list of surveys on success", async () => {
    const { sut } = makeSut();

    const requestModel = mockLoadSurveysRequestModel();
    const surveys = await sut.load(requestModel);

    expect(surveys).toEqual(mockSurveyModelListWithFlag());
  });
});
