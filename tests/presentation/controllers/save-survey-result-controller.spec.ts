import MockDate from "mockdate";
import {
  LoadSurveyById,
  SaveSurveyResult,
  LoadSurveyResult,
} from "../../../src/domain/usecases";
import {
  SaveSurveyResultController,
  SaveSurveyResultRequest,
} from "../../../src/presentation/controllers/save-survey-result-controller";
import { InvalidParamError } from "../../../src/presentation/errors";
import {
  ok,
  forbidden,
  serverError,
} from "../../../src/presentation/helpers/http-helper";
import {
  mockLoadSurveyById,
  mockSaveSurveyResult,
  mockLoadSurveyResult,
  mockSurveyCompiledModel,
} from "../../domain/mocks";

interface SutTypes {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
  loadSurveyResultStub: LoadSurveyResult;
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const saveSurveyResultStub = mockSaveSurveyResult();
  const loadSurveyResultStub = mockLoadSurveyResult();
  const sut = new SaveSurveyResultController(
    loadSurveyByIdStub,
    saveSurveyResultStub,
    loadSurveyResultStub
  );

  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub,
    loadSurveyResultStub,
  };
};

const mockRequest = (): SaveSurveyResultRequest => ({
  surveyId: "any_survey_id",
  answer: "any_answer",
  accountId: "any_account_id",
});

describe("SaveSurveyResultController", () => {
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
    expect(loadByIdSpy).toHaveBeenCalledWith(request.surveyId);
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

  it("should return 403 if answer is not valid", async () => {
    const { sut } = makeSut();

    const request = mockRequest();
    request.answer = "invalid_answer";

    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(forbidden(new InvalidParamError("answer")));
  });

  it("should call SaveSurveyResult with correct value", async () => {
    const { sut, saveSurveyResultStub } = makeSut();

    const saveSpy = jest.spyOn(saveSurveyResultStub, "save");

    const request = mockRequest();
    await sut.handle(request);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith({
      accountId: request.accountId,
      surveyId: request.surveyId,
      answer: request.answer,
      date: new Date(),
    });
  });

  it("should call LoadSurveyResult with correct value", async () => {
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

  it("should return 500 if SaveSurveyResult throws", async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    jest
      .spyOn(saveSurveyResultStub, "save")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const request = mockRequest();
    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it("should return 200 on success", async () => {
    const { sut } = makeSut();

    const request = mockRequest();
    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(ok(mockSurveyCompiledModel()));
  });
});
