import { AddSurveyModel, AddSurveyRepository } from "./db-add-survey-protocols";
import { DbAddSurvey } from "./db-add-survey";

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    add(): Promise<void> {
      return;
    }
  }

  return new AddSurveyRepositoryStub();
};

interface SutTypes {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return { sut, addSurveyRepositoryStub };
};

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
    },
  ],
});

describe("DbAddSurvey Usecase", () => {
  it("should call AddSurveyRepository with correct values", async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, "add");

    const fakeSurveyData = makeFakeSurveyData();
    await sut.add(fakeSurveyData);

    expect(addSpy).toHaveBeenCalledWith(fakeSurveyData);
  });
});
