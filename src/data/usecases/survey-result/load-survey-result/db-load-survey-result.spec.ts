import { LoadBySurveyIdRepository } from "../../../protocols/db/survey-result/load-by-survey-id-repository";
import {
  mockLoadBySurveyIdRepository,
  mockLoadSurveyByIdRepository,
} from "../../../test";
import { DbLoadSurveyResult } from "./db-load-survey-result";
import MockDate from "mockdate";
import { LoadSurveyByIdRepository } from "../../survey/load-survey-by-id/db-load-survey-by-id-protocols";
import { mockSurveyCompiledModel } from "../../../../domain/test";

interface SutTypes {
  sut: DbLoadSurveyResult;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
  loadBySurveyIdRepositoryStub: LoadBySurveyIdRepository;
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const loadBySurveyIdRepositoryStub = mockLoadBySurveyIdRepository();
  const sut = new DbLoadSurveyResult(
    loadSurveyByIdRepositoryStub,
    loadBySurveyIdRepositoryStub
  );
  return { sut, loadSurveyByIdRepositoryStub, loadBySurveyIdRepositoryStub };
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

  it("should call LoadBySurveyIdRepository with correct values", async () => {
    const { sut, loadBySurveyIdRepositoryStub } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(
      loadBySurveyIdRepositoryStub,
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

  it("should throw if LoadBySurveyIdRepository throws", async () => {
    const { sut, loadBySurveyIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadBySurveyIdRepositoryStub, "loadBySurveyId")
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
