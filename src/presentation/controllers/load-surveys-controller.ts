import { LoadSurveys } from "../../domain/usecases/load-surveys";
import { noContent, ok, serverError } from "../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../protocols";

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
