import { SurveyResultModel } from "../../../domain/models/survey-result";
import {
  SaveSurveyResult,
  SaveSurveyResultModel,
} from "../../../domain/usecases/save-survey-result";
import { SaveSurveyResultRepository } from "../../protocols/db/survey/save-survey-result-repository";

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) {}

  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    return await this.saveSurveyResultRepository.save(data);
  }
}
