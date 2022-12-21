import {
  SurveyModel,
  LoadSurveyByIdRepository,
} from "./db-load-survey-by-id-protocols";
import { DbLoadSurveyById } from "./db-load-survey-by-id";
import MockDate from "mockdate";
import { mockSurveyModel } from "../../../../domain/test";
import { mockLoadSurveyByIdRepository } from "../../../test";

interface SutTypes {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);

  return { sut, loadSurveyByIdRepositoryStub };
};

describe("DbLoadSurveyById", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should call LoadSurveyByIdRepository", async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();

    const loadAllSpy = jest.spyOn(loadSurveyByIdRepositoryStub, "loadById");

    await sut.loadById("any_id");

    expect(loadAllSpy).toHaveBeenCalledTimes(1);
    expect(loadAllSpy).toHaveBeenCalledWith("any_id");
  });

  it("should return survey on success", async () => {
    const { sut } = makeSut();

    const survey = await sut.loadById("any_id");

    expect(survey).toEqual(mockSurveyModel());
  });

  it("should throw if LoadSurveysRepository throws", async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdRepositoryStub, "loadById")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.loadById("any_id");

    expect(promise).rejects.toThrow();
  });
});
