import { SurveyAnswerModel } from "../../domain/models";
import { AddSurvey } from "../../domain/usecases";
import { badRequest, noContent, serverError } from "../helpers/http-helper";
import { Controller, HttpResponse, Validation } from "../protocols";

export interface AddSurveyRequest {
  question: string;
  answers: SurveyAnswerModel[];
}

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle(request: AddSurveyRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }

      const { question, answers } = request;

      await this.addSurvey.add({ question, answers, date: new Date() });

      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
