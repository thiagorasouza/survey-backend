import MockDate from "mockdate";
import {
  LoadSurveyByIdRepository,
  LoadSurveyResultRepository,
} from "../../../src/data/protocols";
import { DbLoadSurveyResult } from "../../../src/data/usecases";
import { mockSurveyCompiledModel } from "../../domain/mocks";
import {
  mockLoadSurveyByIdRepository,
  mockLoadSurveyRepository,
  mockLoadSurveyResultRequestModel,
} from "../mocks";

interface SutTypes {
  sut: DbLoadSurveyResult;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const loadSurveyResultRepositoryStub = mockLoadSurveyRepository();
  const sut = new DbLoadSurveyResult(
    loadSurveyByIdRepositoryStub,
    loadSurveyResultRepositoryStub
  );
  return {
    sut,
    loadSurveyByIdRepositoryStub,
    loadSurveyResultRepositoryStub: loadSurveyResultRepositoryStub,
  };
};

describe("DbLoadSurveyResult Usecase", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should call LoadSurveyByIdRepository with correct values", async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, "loadById");

    const requestModel = mockLoadSurveyResultRequestModel();
    await sut.load(requestModel);

    expect(loadByIdSpy).toHaveBeenCalledWith("any_survey_id");
  });

  it("should call LoadSurveyResultRepository with correct values", async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      "loadBySurveyId"
    );

    const requestModel = mockLoadSurveyResultRequestModel();
    await sut.load(requestModel);

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith("any_survey_id");
  });

  it("should throw if LoadSurveyByIdRepository throws", async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdRepositoryStub, "loadById")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const requestModel = mockLoadSurveyResultRequestModel();
    const promise = sut.load(requestModel);

    expect(promise).rejects.toThrow();
  });

  it("should throw if LoadSurveyResultRepository throws", async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const requestModel = mockLoadSurveyResultRequestModel();
    const promise = sut.load(requestModel);

    expect(promise).rejects.toThrow();
  });

  it("should return the compiled survey results on success", async () => {
    const { sut } = makeSut();

    const requestModel = mockLoadSurveyResultRequestModel();
    const surveys = await sut.load(requestModel);

    expect(surveys).toEqual(mockSurveyCompiledModel());
  });
});
