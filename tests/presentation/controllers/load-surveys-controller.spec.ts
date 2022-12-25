import MockDate from "mockdate";
import { LoadSurveys } from "../../../src/domain/usecases";
import {
  LoadSurveysController,
  LoadSurveysRequest,
} from "../../../src/presentation/controllers/load-surveys-controller";
import {
  ok,
  noContent,
  serverError,
} from "../../../src/presentation/helpers/http-helper";
import { mockLoadSurveys, mockSurveyModelList } from "../../domain/mocks";

interface SutTypes {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveys;
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys();
  const sut = new LoadSurveysController(loadSurveysStub);

  return { sut, loadSurveysStub };
};

const mockRequest = (): LoadSurveysRequest => ({
  accountId: "any_account_id",
});

describe("LoadSurveys Controller", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should call LoadSurveys with correct value", async () => {
    const { sut, loadSurveysStub } = makeSut();

    const loadSpy = jest.spyOn(loadSurveysStub, "load");

    await sut.handle(mockRequest());

    expect(loadSpy).toHaveBeenCalledTimes(1);
    expect(loadSpy).toHaveBeenCalledWith("any_account_id");
  });

  it("should return 200 on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok(mockSurveyModelList()));
  });

  it("should return 204 if LoadSurveys returns empty", async () => {
    const { sut, loadSurveysStub } = makeSut();

    jest
      .spyOn(loadSurveysStub, "load")
      .mockReturnValueOnce(Promise.resolve([]));

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(noContent());
  });

  it("should return 500 if LoadSurveys throws", async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest
      .spyOn(loadSurveysStub, "load")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
