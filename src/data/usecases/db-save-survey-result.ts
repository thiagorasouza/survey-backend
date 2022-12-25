import {
  SaveSurveyResult,
  SaveSurveyResultRequestModel,
  SaveSurveyResultResponseModel,
} from "../../domain/usecases/save-survey-result";
import { SaveSurveyResultRepository } from "../protocols/db/survey-result/save-survey-result-repository";

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) {}

  async save(
    surveyData: SaveSurveyResultRequestModel
  ): Promise<SaveSurveyResultResponseModel> {
    return await this.saveSurveyResultRepository.save(surveyData);
  }
}
