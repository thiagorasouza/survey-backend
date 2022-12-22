import { LoadBySurveyIdRepository } from "../../../../data/protocols/db/survey-result/load-by-survey-id-repository";
import { SaveSurveyResultRepository } from "../../../../data/protocols/db/survey-result/save-survey-result-repository";
import { SurveyResultModel } from "../../../../domain/models/survey-result";
import { SaveSurveyResultParams } from "../../../../domain/usecases/survey-result/save-survey-result";
import { MongoHelper } from "../helpers/mongo-helper";

export class SurveyResultMongoRepository
  implements SaveSurveyResultRepository, LoadBySurveyIdRepository
{
  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultsCollection = await MongoHelper.getCollection(
      "surveyResults"
    );
    const response = await surveyResultsCollection.findOneAndUpdate(
      { surveyId: data.surveyId, accountId: data.accountId },
      { $set: { answer: data.answer, date: data.date } },
      { upsert: true, returnDocument: "after" }
    );
    const mapped = MongoHelper.mapId(response.value);
    return mapped;
  }

  async loadBySurveyId(surveyId: string): Promise<SurveyResultModel[]> {
    const surveyResultsCollection = await MongoHelper.getCollection(
      "surveyResults"
    );
    const response = await surveyResultsCollection.find({ surveyId }).toArray();
    const mapped = response.map(MongoHelper.mapId);
    return mapped;
  }
}
