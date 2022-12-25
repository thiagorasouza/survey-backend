import MockDate from "mockdate";
import { SaveSurveyResultRepository } from "../../../src/data/protocols";
import { DbSaveSurveyResult } from "../../../src/data/usecases";
import {
  mockSaveSurveyResultParams,
  mockSurveyResultModel,
} from "../../domain/mocks";
import { mockSaveSurveyResultRepository } from "../mocks";

interface SutTypes {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);
  return { sut, saveSurveyResultRepositoryStub };
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

  it("should throw if SaveSurveyResultRepository throws", async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositoryStub, "save")
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
