import { LoadBySurveyIdRepository } from "../../../protocols/db/survey-result/load-by-survey-id-repository";
import { mockLoadBySurveyIdRepository } from "../../../test";
import { DbLoadSurveyResult } from "./db-load-survey-result";
import MockDate from "mockdate";

interface SutTypes {
  sut: DbLoadSurveyResult;
  loadBySurveyIdRepositoryStub: LoadBySurveyIdRepository;
}

const makeSut = (): SutTypes => {
  const loadBySurveyIdRepositoryStub = mockLoadBySurveyIdRepository();
  const sut = new DbLoadSurveyResult(loadBySurveyIdRepositoryStub);
  return { sut, loadBySurveyIdRepositoryStub };
};

describe("DbLoadSurveyResult Usecase", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
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

  // it("should throw if LoadBySurveyIdRepository throws", async () => {
  //   const { sut, loadBySurveyIdRepositoryStub } = makeSut();
  //   jest
  //     .spyOn(loadBySurveyIdRepositoryStub, "loadBySurveyId")
  //     .mockReturnValueOnce(Promise.reject(new Error()));

  //   const promise = sut.load("any_survey_id");

  //   expect(promise).rejects.toThrow();
  // });

  // it("should return the compiled survey results on success", async () => {
  //   const { sut } = makeSut();

  //   const fakeSurveyData = mockSaveSurveyResultParams();
  //   const surveys = await sut.save(fakeSurveyData);

  //   expect(surveys).toEqual(mockSurveyCompiledModel());
  // });
});
