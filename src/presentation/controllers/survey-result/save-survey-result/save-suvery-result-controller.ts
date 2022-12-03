import { LoadSurveyById } from "../../../../domain/usecases/survey/load-survey-by-id";
import { InvalidParamError } from "../../../errors";
import { forbidden, serverError } from "../../../helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../../protocols";

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(
        httpRequest.params.surveyId
      );
      if (!survey) {
        return forbidden(new InvalidParamError("surveyId"));
      }
    } catch (error) {
      return serverError(error);
    }
  }
}
