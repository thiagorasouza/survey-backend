import { LoadSurveysRepository } from "./db-load-surveys-protocols";
import { DbLoadSurveys } from "./db-load-surveys";
import MockDate from "mockdate";
import {
  mockLoadByAccountIdRepository,
  mockLoadSurveysRepository,
} from "../../../test";
import { LoadByAccountIdRepository } from "../../../protocols/db/survey-result/load-by-account-id-repository";

interface SutTypes {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepository;
  loadByAccountIdRepositoryStub: LoadByAccountIdRepository;
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository();
  const loadByAccountIdRepositoryStub = mockLoadByAccountIdRepository();
  const sut = new DbLoadSurveys(
    loadSurveysRepositoryStub,
    loadByAccountIdRepositoryStub
  );

  return { sut, loadSurveysRepositoryStub, loadByAccountIdRepositoryStub };
};

describe("DbLoadSurveys", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should call LoadSurveysRepository", async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();

    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, "loadAll");

    await sut.load("any_account_id");

    expect(loadAllSpy).toHaveBeenCalledTimes(1);
  });

  it("should throw if LoadSurveysRepository throws", async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveysRepositoryStub, "loadAll")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.load("any_account_id");

    expect(promise).rejects.toThrow();
  });

  it("should call LoadByAccountIdRepository with correct value", async () => {
    const { sut, loadByAccountIdRepositoryStub } = makeSut();

    const loadByAccountIdSpy = jest.spyOn(
      loadByAccountIdRepositoryStub,
      "loadByAccountId"
    );

    await sut.load("any_account_id");

    expect(loadByAccountIdSpy).toHaveBeenCalledTimes(1);
    expect(loadByAccountIdSpy).toHaveBeenCalledWith("any_account_id");
  });

  // it("should return a compiled list of surveys on success", async () => {
  //   const { sut } = makeSut();

  //   const surveys = await sut.load("any_account_id");

  //   expect(surveys).toEqual([
  //     {
  //       id: "any_id",
  //       question: "any_question",
  //       didAnswer: false,
  //       answers: [
  //         {
  //           image: "any_image",
  //           answer: "any_answer",
  //         },
  //       ],
  //       date: new Date(),
  //     },
  //     {
  //       id: "other_id",
  //       question: "other_question",
  //       didAnswer: true,
  //       answers: [
  //         {
  //           image: "other_image",
  //           answer: "other_answer",
  //         },
  //       ],
  //       date: new Date(),
  //     },
  //   ]);
  // });
});
