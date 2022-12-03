import { SurveyResultModel } from "../../../../domain/models/survey-result";
import { SaveSurveyResultModel } from "../../../../domain/usecases/survey-result/save-survey-result";
import { DbSaveSurveyResult } from "./db-save-survey-result";
import MockDate from "mockdate";
import { SaveSurveyResultRepository } from "../../../protocols/db/survey-result/save-survey-result-repository";

const makesaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return makeFakeSurveyResult();
    }
  }

  return new SaveSurveyResultRepositoryStub();
};

interface SutTypes {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makesaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);
  return { sut, saveSurveyResultRepositoryStub };
};

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: "any_id",
  accountId: "any_account_id",
  surveyId: "any_survey_id",
  answer: "any_answer",
  date: new Date(),
});

const makeFakeSaveSurveyResultData = (): SaveSurveyResultModel => {
  const { id, ...rest } = makeFakeSurveyResult();
  return rest;
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

    const fakeData = makeFakeSaveSurveyResultData();
    await sut.save(fakeData);

    expect(saveSpy).toHaveBeenCalledWith(fakeData);
  });

  it("should throw if SaveSurveyResultRepository throws", async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositoryStub, "save")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const fakeSurveyData = makeFakeSaveSurveyResultData();
    const promise = sut.save(fakeSurveyData);

    expect(promise).rejects.toThrow();
  });

  it("should return the survey result on success", async () => {
    const { sut } = makeSut();

    const fakeSurveyData = makeFakeSaveSurveyResultData();
    const surveys = await sut.save(fakeSurveyData);

    expect(surveys).toEqual(makeFakeSurveyResult());
  });
});
