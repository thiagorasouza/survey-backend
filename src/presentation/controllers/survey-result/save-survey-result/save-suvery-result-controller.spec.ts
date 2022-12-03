import { SurveyModel } from "../../../../domain/models/survey";
import { LoadSurveyById } from "../../../../domain/usecases/survey/load-survey-by-id";
import { InvalidParamError } from "../../../errors";
import { forbidden, serverError } from "../../../helpers/http/http-helper";
import { HttpRequest } from "../../../protocols";
import { SaveSurveyResultController } from "./save-suvery-result-controller";

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(): Promise<SurveyModel> {
      return makeFakeSurveyModel();
    }
  }

  return new LoadSurveyByIdStub();
};

interface SutTypes {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById();
  const sut = new SaveSurveyResultController(loadSurveyByIdStub);

  return { sut, loadSurveyByIdStub };
};

const makeFakeSurveyModel = (): SurveyModel => {
  return {
    id: "any_id",
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
    date: new Date(),
  };
};

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: "any_id",
  },
  body: {
    answer: "any_answer",
  },
});

describe("SaveSurveyResultController", () => {
  it("should call LoadSurveyById with correct value", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, "loadById");

    const request = makeFakeRequest();
    await sut.handle(request);

    expect(loadByIdSpy).toHaveBeenCalledTimes(1);
    expect(loadByIdSpy).toHaveBeenCalledWith(request.params.surveyId);
  });

  it("should return 403 if LoadSurveyById returns null", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdStub, "loadById")
      .mockReturnValueOnce(Promise.resolve(null));

    const request = makeFakeRequest();
    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(forbidden(new InvalidParamError("surveyId")));
  });

  it("should return 403 if answer is not valid", async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeRequest();
    httpRequest.body.answer = "invalid_answer";

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(forbidden(new InvalidParamError("answer")));
  });

  it("should return 500 if LoadSurveyById throws", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, "loadById")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const request = makeFakeRequest();
    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
