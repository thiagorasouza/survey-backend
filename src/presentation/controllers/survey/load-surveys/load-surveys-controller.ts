import { LoadSurveys } from "../../../../domain/usecases/survey/load-surveys";
import { noContent, ok, serverError } from "../../../helpers/http/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../add-survey/add-survey-controller-protocols";

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest;
      const surveys = await this.loadSurveys.load(accountId);
      if (surveys.length === 0) {
        return noContent();
      }

      return ok(surveys);
    } catch (error) {
      return serverError(error);
    }
  }
}
