import { LoadSurveyResult } from "../../domain/usecases/load-survey-result";
import { SaveSurveyResult } from "../../domain/usecases/save-survey-result";
import { LoadSurveyById } from "../../domain/usecases/load-survey-by-id";
import { InvalidParamError } from "../errors";
import { forbidden, notFound, ok, serverError } from "../helpers/http-helper";
import { Controller, HttpResponse } from "../protocols";

export interface SaveSurveyResultRequest {
  accountId: string;
  surveyId: string;
  answer: string;
}

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle(request: SaveSurveyResultRequest): Promise<HttpResponse> {
    try {
      const { accountId, surveyId, answer } = request;

      const survey = await this.loadSurveyById.loadById({ id: surveyId });
      if (!survey) {
        return notFound();
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
