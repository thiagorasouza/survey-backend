import { LoadSurveyResultRepository } from "../../../protocols/db/survey-result/load-survey-result-repository";
import {
  mockLoadSurveyRepository,
  mockLoadSurveyByIdRepository,
} from "../../../test";
import { DbLoadSurveyResult } from "./db-load-survey-result";
import MockDate from "mockdate";
import { LoadSurveyByIdRepository } from "../../survey/load-survey-by-id/db-load-survey-by-id-protocols";
import { mockSurveyCompiledModel } from "../../../../domain/test";

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

    await sut.load("any_survey_id");

    expect(loadByIdSpy).toHaveBeenCalledWith("any_survey_id");
  });

  it("should call LoadSurveyResultRepository with correct values", async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      "loadBySurveyId"
    );

    await sut.load("any_survey_id");

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith("any_survey_id");
  });

  it("should throw if LoadSurveyByIdRepository throws", async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdRepositoryStub, "loadById")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.load("any_survey_id");

    expect(promise).rejects.toThrow();
  });

  it("should throw if LoadSurveyResultRepository throws", async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.load("any_survey_id");

    expect(promise).rejects.toThrow();
  });

  it("should return the compiled survey results on success", async () => {
    const { sut } = makeSut();

    const surveys = await sut.load("any_survey_id");

    expect(surveys).toEqual(mockSurveyCompiledModel());
  });
});
