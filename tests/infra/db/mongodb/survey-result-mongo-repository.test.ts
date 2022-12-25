import MockDate from "mockdate";
import { Collection, ObjectId } from "mongodb";
import { SurveyModel, AccountModel } from "../../../../src/domain/models";
import {
  SurveyResultMongoRepository,
  MongoHelper,
} from "../../../../src/infra/db/mongodb";
import env from "../../../../src/main/config/env";
import {
  mockAddSurveyParams,
  mockAddAccountRequestModel,
} from "../../../domain/mocks";

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository();
};

describe("Survey Mongo Repository", () => {
  let surveys: Collection;
  let surveyResults: Collection;
  let accounts: Collection;

  const makeSurvey = async (): Promise<SurveyModel> => {
    const surveyData = mockAddSurveyParams();
    const response = await surveys.insertOne(surveyData);
    const { insertedId } = response;
    const survey = await surveys.findOne({ _id: insertedId });
    return MongoHelper.mapId(survey);
  };

  const makeAccount = async (): Promise<AccountModel> => {
    const surveyData = mockAddAccountRequestModel();
    const response = await accounts.insertOne(surveyData);
    const { insertedId } = response;
    const account = await accounts.findOne({ _id: insertedId });
    return MongoHelper.mapId(account);
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
    MockDate.set(new Date());
    await MongoHelper.connect(env.mongoUrl);
  });

  afterAll(async () => {
    MockDate.reset();
    await MongoHelper.disconnect();
  });

  describe(".save()", () => {
    it("should add a survey result if new", async () => {
      const sut = makeSut();
      const survey = await makeSurvey();
      const account = await makeAccount();

      const surveyResult = {
        surveyId: survey.id,
        accountId: account.id,
        answer: mockAddSurveyParams().answers[0].answer,
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
      const survey = await makeSurvey();
      const account = await makeAccount();

      const surveyResult = {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: mockAddSurveyParams().answers[0].answer,
        date: new Date(),
      };

      const { insertedId } = await surveyResults.insertOne(surveyResult);

      const surveyResultUpdated = {
        surveyId: survey.id,
        accountId: account.id,
        answer: mockAddSurveyParams().answers[1].answer,
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

  describe(".loadBySurveyId()", () => {
    it("should load survey results by survey id", async () => {
      const sut = makeSut();
      const survey = await makeSurvey();
      const account = await makeAccount();

      const surveyResult1 = {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: mockAddSurveyParams().answers[0].answer,
        date: new Date(),
      };
      const surveyResult2 = {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: mockAddSurveyParams().answers[0].answer,
        date: new Date(),
      };
      const { insertedIds } = await surveyResults.insertMany([
        { ...surveyResult1 },
        { ...surveyResult2 },
      ]);

      const results = await sut.loadBySurveyId(survey.id);

      expect(results).toEqual([
        {
          id: insertedIds[0].toString(),
          surveyId: survey.id,
          accountId: account.id,
          answer: mockAddSurveyParams().answers[0].answer,
          date: new Date(),
        },
        {
          id: insertedIds[1].toString(),
          surveyId: survey.id,
          accountId: account.id,
          answer: mockAddSurveyParams().answers[0].answer,
          date: new Date(),
        },
      ]);
    });
  });

  describe(".loadByAccountId()", () => {
    it("should load survey results by account id", async () => {
      const sut = makeSut();
      const survey = await makeSurvey();
      const account = await makeAccount();

      const surveyResult1 = {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: mockAddSurveyParams().answers[0].answer,
        date: new Date(),
      };
      const surveyResult2 = {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: mockAddSurveyParams().answers[0].answer,
        date: new Date(),
      };
      const { insertedIds } = await surveyResults.insertMany([
        { ...surveyResult1 },
        { ...surveyResult2 },
      ]);

      const results = await sut.loadByAccountId(account.id);

      expect(results).toEqual([
        {
          id: insertedIds[0].toString(),
          surveyId: survey.id,
          accountId: account.id,
          answer: mockAddSurveyParams().answers[0].answer,
          date: new Date(),
        },
        {
          id: insertedIds[1].toString(),
          surveyId: survey.id,
          accountId: account.id,
          answer: mockAddSurveyParams().answers[0].answer,
          date: new Date(),
        },
      ]);
    });
  });
});
