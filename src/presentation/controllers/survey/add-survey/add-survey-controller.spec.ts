import { Validation } from "presentation/protocols";
import { AddSurveyController } from "./add-survey-controller";
import { HttpRequest } from "./add-survey-controller-protocols";

interface SutTypes {
  sut: AddSurveyController;
  validationStub: Validation;
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(): null | Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const sut = new AddSurveyController(validationStub);

  return { sut, validationStub };
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
  },
});

describe("Add Survey Controller", () => {
  it("should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");

    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
