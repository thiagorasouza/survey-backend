import { SurveyResultModel } from "../../../../domain/models/survey-result";
import { SaveSurveyResultParams } from "../../../../domain/usecases/survey-result/save-survey-result";
import { DbSaveSurveyResult } from "./db-save-survey-result";
import MockDate from "mockdate";
import { SaveSurveyResultRepository } from "../../../protocols/db/survey-result/save-survey-result-repository";
import {
  mockSaveSurveyResultParams,
  mockSurveyResultModel,
} from "../../../../domain/test";
import {
  mockLoadBySurveyIdRepository,
  mockSaveSurveyResultRepository,
} from "../../../test";
import { LoadBySurveyIdRepository } from "../../../protocols/db/survey-result/load-by-survey-id-repository";

interface SutTypes {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
  loadBySurveyIdRepositoryStub: LoadBySurveyIdRepository;
}

const makeSut = (): SutTypes => {
  const loadBySurveyIdRepositoryStub = mockLoadBySurveyIdRepository();
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositoryStub,
    loadBySurveyIdRepositoryStub
  );
  return { sut, saveSurveyResultRepositoryStub, loadBySurveyIdRepositoryStub };
};

describe("DbSaveSurveyResult Usecase", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should call SaveSurveyResultRepository with correct values", async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, "save");

    const fakeData = mockSaveSurveyResultParams();
    await sut.save(fakeData);

    expect(saveSpy).toHaveBeenCalledWith(fakeData);
  });

  it("should call LoadBySurveyIdRepository with correct values", async () => {
    const { sut, loadBySurveyIdRepositoryStub } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(
      loadBySurveyIdRepositoryStub,
      "loadBySurveyId"
    );

    const fakeData = mockSaveSurveyResultParams();
    await sut.save(fakeData);

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(fakeData.surveyId);
  });

  it("should throw if SaveSurveyResultRepository throws", async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositoryStub, "save")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const fakeSurveyData = mockSaveSurveyResultParams();
    const promise = sut.save(fakeSurveyData);

    expect(promise).rejects.toThrow();
  });

  it("should throw if LoadBySurveyIdRepository throws", async () => {
    const { sut, loadBySurveyIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadBySurveyIdRepositoryStub, "loadBySurveyId")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const fakeSurveyData = mockSaveSurveyResultParams();
    const promise = sut.save(fakeSurveyData);

    expect(promise).rejects.toThrow();
  });

  it("should return the survey result on success", async () => {
    const { sut } = makeSut();

    const fakeSurveyData = mockSaveSurveyResultParams();
    const surveys = await sut.save(fakeSurveyData);

    expect(surveys).toEqual(mockSurveyResultModel());
  });
});
