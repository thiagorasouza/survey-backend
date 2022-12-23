import { SaveSurveyResult } from "../../../../domain/usecases/survey-result/save-survey-result";
import { LoadSurveyById } from "../../../../domain/usecases/survey/load-survey-by-id";
import { InvalidParamError } from "../../../errors";
import { forbidden, ok, serverError } from "../../../helpers/http/http-helper";
import { HttpRequest } from "../../../protocols";
import { SaveSurveyResultController } from "./save-survey-result-controller";
import MockDate from "mockdate";
import {
  mockLoadSurveyById,
  mockLoadSurveyResult,
  mockSaveSurveyResult,
  mockSurveyCompiledModel,
} from "../../../../domain/test";
import { LoadSurveyResult } from "../../../../domain/usecases/survey-result/load-survey-result";

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

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: "any_survey_id",
  },
  body: {
    answer: "any_answer",
  },
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
    expect(loadByIdSpy).toHaveBeenCalledWith(request.params.surveyId);
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

    const httpRequest = mockRequest();
    httpRequest.body.answer = "invalid_answer";

    const httpResponse = await sut.handle(httpRequest);

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
      surveyId: request.params.surveyId,
      answer: request.body.answer,
      date: new Date(),
    });
  });

  it("should call LoadSurveyResult with correct value", async () => {
    const { sut, loadSurveyResultStub } = makeSut();

    const loadSpy = jest.spyOn(loadSurveyResultStub, "load");

    const request = mockRequest();
    await sut.handle(request);

    expect(loadSpy).toHaveBeenCalledTimes(1);
    expect(loadSpy).toHaveBeenCalledWith("any_survey_id");
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
