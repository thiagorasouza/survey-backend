import {
  LoadSurveyById,
  LoadSurveyByIdRequestModel,
  LoadSurveyByIdResponseModel,
} from "../../domain/usecases";
import { LoadSurveyByIdRepository } from "../protocols";

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async loadById(
    requestModel: LoadSurveyByIdRequestModel
  ): Promise<LoadSurveyByIdResponseModel> {
    return await this.loadSurveyByIdRepository.loadById(requestModel.id);
  }
}
