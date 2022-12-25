import MockDate from "mockdate";
import { LoadSurveyByIdRepository } from "../../../src/data/protocols";
import { DbLoadSurveyById } from "../../../src/data/usecases";
import { mockSurveyModel } from "../../domain/mocks";
import {
  mockLoadSurveyByIdRepository,
  mockLoadSurveyByIdRequestModel,
} from "../mocks";

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

    const requestModel = mockLoadSurveyByIdRequestModel();
    await sut.loadById(requestModel);

    expect(loadAllSpy).toHaveBeenCalledTimes(1);
    expect(loadAllSpy).toHaveBeenCalledWith(requestModel.id);
  });

  it("should return survey on success", async () => {
    const { sut } = makeSut();

    const requestModel = mockLoadSurveyByIdRequestModel();
    const survey = await sut.loadById(requestModel);

    expect(survey).toEqual(mockSurveyModel());
  });

  it("should throw if LoadSurveysRepository throws", async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdRepositoryStub, "loadById")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const requestModel = mockLoadSurveyByIdRequestModel();
    const promise = sut.loadById(requestModel);

    expect(promise).rejects.toThrow();
  });
});
