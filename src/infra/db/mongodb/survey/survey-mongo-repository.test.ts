import { Collection } from "mongodb";
import { AddSurveyModel } from "../../../../domain/usecases/add-survey";
import env from "../../../../main/config/env";
import { MongoHelper } from "../helpers/mongo-helper";
import { SurveyMongoRepository } from "./survey-mongo-repository";

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};

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

describe("Survey Mongo Repository", () => {
  let surveys: Collection;

  beforeEach(async () => {
    surveys = await MongoHelper.getCollection("surveys");
    await surveys.deleteMany({});
  });

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe(".add()", () => {
    it("should add a survey on success", async () => {
      const sut = makeSut();
      const surveyData = makeFakeSurveyData();
      await sut.add(surveyData);
      const survey = await surveys.findOne({ question: "any_question" });
      expect(survey).toBeTruthy();
    });
  });

  describe(".loadAll()", () => {
    it("should load all surveys on success", async () => {
      const sut = makeSut();

      const surveyData = makeFakeSurveyData();
      await surveys.insertMany([surveyData, { ...surveyData }]);

      const response = await sut.loadAll();
      expect(response.length).toBe(2);
    });
  });
});
