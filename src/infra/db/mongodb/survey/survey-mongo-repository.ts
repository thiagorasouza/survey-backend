import { ObjectId } from "mongodb";
import { LoadSurveysRepository } from "../../../../data/protocols/db/survey/load-surveys-repository";
import {
  AddSurveyParams,
  AddSurveyRepository,
} from "../../../../data/usecases/survey/add-survey/db-add-survey-protocols";
import { LoadSurveyByIdRepository } from "../../../../data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols";
import { SurveyModel } from "../../../../domain/models/survey";
import { MongoHelper } from "../helpers/mongo-helper";

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository
{
  async add(surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.insertOne(surveyData);
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveys = await MongoHelper.getCollection("surveys");
    const result = await surveys.find().toArray();
    const mapped = result.map(MongoHelper.mapId);
    return mapped;
  }

  async loadById(id: string): Promise<SurveyModel> {
    const surveys = await MongoHelper.getCollection("surveys");
    const objId = new ObjectId(id);
    const result = await surveys.findOne({ _id: objId });
    const mapped = MongoHelper.mapId(result);
    return mapped;
  }
}
