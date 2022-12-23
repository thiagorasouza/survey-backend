import { LoadSurveyResult } from "../../../../domain/usecases/survey-result/load-survey-result";
import { LoadSurveyById } from "../../../../domain/usecases/survey/load-survey-by-id";
import { InvalidParamError } from "../../../errors";
import { forbidden, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../../protocols";

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accountId = httpRequest.accountId;
      const { surveyId } = httpRequest.params;
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError("surveyId"));
      }

      const surveyCompiled = await this.loadSurveyResult.load(
        surveyId,
        accountId
      );

      return ok(surveyCompiled);
    } catch (error) {
      return serverError(error);
    }
  }
}
