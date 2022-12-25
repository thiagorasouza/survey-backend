import { LoadSurveyResult } from "../../domain/usecases/load-survey-result";
import { SaveSurveyResult } from "../../domain/usecases/save-survey-result";
import { LoadSurveyById } from "../../domain/usecases/load-survey-by-id";
import { InvalidParamError } from "../errors";
import { forbidden, ok, serverError } from "../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../protocols";

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accountId = httpRequest.accountId;
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

      await this.saveSurveyResult.save({
        accountId,
        surveyId,
        answer,
        date: new Date(),
      });

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
