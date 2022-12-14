import { Collection } from "mongodb";
import {
  SurveyMongoRepository,
  MongoHelper,
} from "../../../../src/infra/db/mongodb";
import env from "../../../../src/main/config/env";
import { mockAddSurveyParams } from "../../../domain/mocks";

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};

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
      const surveyData = mockAddSurveyParams();
      await sut.add(surveyData);
      const survey = await surveys.findOne({ question: "any_question" });
      expect(survey).toBeTruthy();
    });
  });

  describe(".loadAll()", () => {
    it("should load all surveys on success", async () => {
      const sut = makeSut();

      const surveyData = mockAddSurveyParams();
      await surveys.insertMany([surveyData, { ...surveyData }]);

      const result = await sut.loadAll();
      expect(result.length).toBe(2);

      expect(result[0].id).toBeTruthy();
      expect(result[0].answers).toEqual(surveyData.answers);
      expect(result[0].date.toISOString()).toBe(surveyData.date.toISOString());
      expect(result[0].question).toBe(surveyData.question);

      expect(result[1].id).toBeTruthy();
      expect(result[1].answers).toEqual(surveyData.answers);
      expect(result[1].date.toISOString()).toBe(surveyData.date.toISOString());
      expect(result[1].question).toBe(surveyData.question);
    });

    it("should return an empty array if there are no surveys", async () => {
      const sut = makeSut();

      const response = await sut.loadAll();
      expect(response.length).toBe(0);
    });
  });

  describe(".loadById()", () => {
    it("should load survey by id on success", async () => {
      const sut = makeSut();

      const surveyData = mockAddSurveyParams();
      const response = await surveys.insertOne(surveyData);
      const { insertedId } = response;
      const id = insertedId.toString();

      const result = await sut.loadById(id);

      expect(result.id).toBeTruthy();
      expect(result.answers).toEqual(surveyData.answers);
      expect(result.date.toISOString()).toBe(surveyData.date.toISOString());
      expect(result.question).toBe(surveyData.question);
    });
  });
});
