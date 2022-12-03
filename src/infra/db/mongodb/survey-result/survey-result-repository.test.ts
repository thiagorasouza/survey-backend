import { Collection } from "mongodb";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { AddSurveyModel } from "../../../../domain/usecases/add-survey";
import env from "../../../../main/config/env";
import { MongoHelper } from "../helpers/mongo-helper";
import { SurveyResultMongoRepository } from "./survey-result-repository";

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository();
};

describe("Survey Mongo Repository", () => {
  let surveys: Collection;
  let surveyResults: Collection;
  let accounts: Collection;

  const makeFakeSurveyData = (): AddSurveyModel => ({
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
      { answer: "other_answer" },
    ],
    date: new Date(),
  });

  const makeFakeAccountData = (): AddAccountModel => ({
    name: "any_name",
    email: "any_email",
    password: "any_password",
  });

  const makeSurvey = async (): Promise<string> => {
    const surveyData = makeFakeSurveyData();
    const response = await surveys.insertOne(surveyData);
    const { insertedId } = response;
    return insertedId.toString();
  };

  const makeAccount = async (): Promise<string> => {
    const surveyData = makeFakeAccountData();
    const response = await accounts.insertOne(surveyData);
    const { insertedId } = response;
    return insertedId.toString();
  };

  beforeEach(async () => {
    surveys = await MongoHelper.getCollection("surveys");
    await surveys.deleteMany({});

    surveyResults = await MongoHelper.getCollection("surveyResults");
    await surveyResults.deleteMany({});

    accounts = await MongoHelper.getCollection("accounts");
    await accounts.deleteMany({});
  });

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe(".save()", () => {
    it("should add a survey result if new", async () => {
      const sut = makeSut();
      const surveyId = await makeSurvey();
      const accountId = await makeAccount();

      const surveyResult = {
        surveyId,
        accountId,
        answer: makeFakeSurveyData().answers[0].answer,
        date: new Date(),
      };

      const result = await sut.save(surveyResult);

      // expect(result).toBeTruthy();
      expect(result.id).toBeTruthy();
      expect(result.surveyId).toBe(surveyResult.surveyId);
      expect(result.accountId).toBe(surveyResult.accountId);
      expect(result.answer).toBe(surveyResult.answer);
      expect(result.date.toISOString()).toEqual(
        surveyResult.date.toISOString()
      );
    });

    it("should update a survey result if not new", async () => {
      const sut = makeSut();
      const surveyId = await makeSurvey();
      const accountId = await makeAccount();

      const surveyResult = {
        surveyId,
        accountId,
        answer: makeFakeSurveyData().answers[0].answer,
        date: new Date(),
      };

      const { insertedId } = await surveys.insertOne(surveyResult);

      const surveyResultUpdated = {
        surveyId,
        accountId,
        answer: makeFakeSurveyData().answers[1].answer,
        date: new Date(),
      };

      const result = await sut.save(surveyResultUpdated);

      expect(result.id).toBe(insertedId.toString());
      expect(result.surveyId).toBe(surveyResultUpdated.surveyId);
      expect(result.accountId).toBe(surveyResultUpdated.accountId);
      expect(result.answer).toBe(surveyResultUpdated.answer);
      expect(result.date).toEqual(new Date(surveyResultUpdated.date));
    });
  });
});
