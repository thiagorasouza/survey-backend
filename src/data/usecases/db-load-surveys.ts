import {
  LoadSurveys,
  LoadSurveysRequestModel,
  LoadSurveysResponseModel,
} from "../../domain/usecases";
import { LoadByAccountIdRepository, LoadSurveysRepository } from "../protocols";

export class DbLoadSurveys implements LoadSurveys {
  constructor(
    private readonly loadSurveysRepository: LoadSurveysRepository,
    private readonly loadByAccountIdRepository: LoadByAccountIdRepository
  ) {}

  async load(
    requestModel: LoadSurveysRequestModel
  ): Promise<LoadSurveysResponseModel> {
    const { accountId } = requestModel;

    const surveyResults = await this.loadByAccountIdRepository.loadByAccountId(
      accountId
    );

    const surveysAnswered = surveyResults.map(
      (surveyResult) => surveyResult.surveyId
    );

    const surveys = await this.loadSurveysRepository.loadAll();

    const response = surveys.map((survey) => ({
      ...survey,
      didAnswer: surveysAnswered.includes(survey.id),
    }));

    return response;
  }
}
