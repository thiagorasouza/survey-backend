import MockDate from "mockdate";
import { LoadSurveyById, LoadSurveyResult } from "../../../src/domain/usecases";
import {
  LoadSurveyResultController,
  LoadSurveyResultRequest,
} from "../../../src/presentation/controllers/load-survey-result-controller";
import { InvalidParamError } from "../../../src/presentation/errors";
import {
  ok,
  forbidden,
  serverError,
} from "../../../src/presentation/helpers/http-helper";
import { mockLoadSurveyByIdRequestModel } from "../../data/mocks";
import {
  mockLoadSurveyById,
  mockLoadSurveyResult,
  mockSurveyCompiledModel,
} from "../../domain/mocks";

interface SutTypes {
  sut: LoadSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  loadSurveyResultStub: LoadSurveyResult;
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const loadSurveyResultStub = mockLoadSurveyResult();
  const sut = new LoadSurveyResultController(
    loadSurveyByIdStub,
    loadSurveyResultStub
  );

  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub,
  };
};

const mockRequest = (): LoadSurveyResultRequest => ({
  surveyId: "any_survey_id",
  accountId: "any_account_id",
});

describe("LoadSurveyResultController", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should call LoadSurveyById with correct value", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, "loadById");

    const request = mockRequest();
    await sut.handle(request);

    expect(loadByIdSpy).toHaveBeenCalledTimes(1);
    expect(loadByIdSpy).toHaveBeenCalledWith(mockLoadSurveyByIdRequestModel());
  });

  it("should return 403 if LoadSurveyById returns null", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdStub, "loadById")
      .mockReturnValueOnce(Promise.resolve(null));

    const request = mockRequest();
    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(forbidden(new InvalidParamError("surveyId")));
  });

  it("should call LoadSurveyResult with correct values", async () => {
    const { sut, loadSurveyResultStub } = makeSut();

    const loadSpy = jest.spyOn(loadSurveyResultStub, "load");

    const request = mockRequest();
    await sut.handle(request);

    expect(loadSpy).toHaveBeenCalledTimes(1);
    expect(loadSpy).toHaveBeenCalledWith(request.surveyId, request.accountId);
  });

  it("should return 500 if LoadSurveyById throws", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, "loadById")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const request = mockRequest();
    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it("should return 500 if LoadSurveyResult throws", async () => {
    const { sut, loadSurveyResultStub } = makeSut();
    jest
      .spyOn(loadSurveyResultStub, "load")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const request = mockRequest();
    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it("should return 200 with compiled results on success", async () => {
    const { sut } = makeSut();

    const request = mockRequest();
    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(ok(mockSurveyCompiledModel()));
  });
});
