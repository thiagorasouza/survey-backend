import { ObjectId } from "mongodb";
import {
  AddSurveyRepository,
  LoadSurveysRepository,
  LoadSurveyByIdRepository,
} from "../../../data/protocols";
import { SurveyModel } from "../../../domain/models";
import { AddSurveyRequestModel } from "../../../domain/usecases";
import { MongoHelper } from "./mongo-helper";

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository
{
  async add(surveyData: AddSurveyRequestModel): Promise<void> {
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
