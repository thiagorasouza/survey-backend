import { SurveyResultModel } from "../../../../domain/models/survey-result";
import {
  SaveSurveyResult,
  SaveSurveyResultModel,
} from "../../../../domain/usecases/survey-result/save-survey-result";
import { MongoHelper } from "../helpers/mongo-helper";

export class SurveyResultMongoRepository implements SaveSurveyResult {
  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
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
}
