import { SurveyResultModel } from "../../../domain/models/survey-result";
import { SaveSurveyResultModel } from "../../../domain/usecases/save-survey-result";
import { DbSaveSurveyResult } from "./db-save-survey-result";
import MockDate from "mockdate";
import { SaveSurveyResultRepository } from "../../protocols/db/survey/save-survey-result-repository";

const makesaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return;
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

  // it("should throw if AddSurveyRepository throws", async () => {
  //   const { sut, addSurveyRepositoryStub } = makeSut();
  //   jest
  //     .spyOn(addSurveyRepositoryStub, "add")
  //     .mockReturnValueOnce(Promise.reject(new Error()));

  //   const fakeSurveyData = makeFakeSurveyData();
  //   const promise = sut.add(fakeSurveyData);

  //   expect(promise).rejects.toThrow();
  // });
});
