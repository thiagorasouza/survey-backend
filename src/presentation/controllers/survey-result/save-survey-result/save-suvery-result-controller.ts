import { LoadSurveyById } from "../../../../domain/usecases/survey/load-survey-by-id";
import { InvalidParamError } from "../../../errors";
import { forbidden, serverError } from "../../../helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../../protocols";

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const { answer } = httpRequest.body;

      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError("surveyId"));
      }

      const surveyAnswers = survey.answers.map((item) => item.answer);

      if (!surveyAnswers.includes(answer)) {
        return forbidden(new InvalidParamError("answer"));
      }
    } catch (error) {
      return serverError(error);
    }
  }
}
