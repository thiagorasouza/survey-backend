import MockDate from "mockdate";
import { AddSurveyRepository } from "../../../src/data/protocols";
import { DbAddSurvey } from "../../../src/data/usecases";
import { mockAddSurveyParams } from "../../domain/mocks";
import { mockAddSurveyRepository } from "../mocks";

interface SutTypes {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return { sut, addSurveyRepositoryStub };
};

describe("DbAddSurvey Usecase", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should call AddSurveyRepository with correct values", async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, "add");

    const fakeSurveyData = mockAddSurveyParams();
    await sut.add(fakeSurveyData);

    expect(addSpy).toHaveBeenCalledWith(fakeSurveyData);
  });

  it("should throw if AddSurveyRepository throws", async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest
      .spyOn(addSurveyRepositoryStub, "add")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const fakeSurveyData = mockAddSurveyParams();
    const promise = sut.add(fakeSurveyData);

    expect(promise).rejects.toThrow();
  });
});
