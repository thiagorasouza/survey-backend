import { LoadSurveyResult } from "../../domain/usecases/load-survey-result";
import { LoadSurveyById } from "../../domain/usecases/load-survey-by-id";
import { InvalidParamError } from "../errors";
import { forbidden, ok, serverError } from "../helpers/http-helper";
import { Controller, HttpResponse } from "../protocols";

export interface LoadSurveyResultRequest {
  accountId: string;
  surveyId: string;
}

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle(request: LoadSurveyResultRequest): Promise<HttpResponse> {
    try {
      const { accountId, surveyId } = request;

      const survey = await this.loadSurveyById.loadById({ id: surveyId });
      if (!survey) {
        return forbidden(new InvalidParamError("surveyId"));
      }

      const surveyCompiled = await this.loadSurveyResult.load({
        surveyId,
        accountId,
      });

      return ok(surveyCompiled);
    } catch (error) {
      return serverError(error);
    }
  }
}
