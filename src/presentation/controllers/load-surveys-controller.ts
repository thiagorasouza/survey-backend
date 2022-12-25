import { LoadSurveys } from "../../domain/usecases/load-surveys";
import { noContent, ok, serverError } from "../helpers/http-helper";
import { Controller, HttpResponse } from "../protocols";

export interface LoadSurveysRequest {
  accountId: string;
}

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handle(request: LoadSurveysRequest): Promise<HttpResponse> {
    try {
      const { accountId } = request;
      const surveys = await this.loadSurveys.load({ accountId });
      if (surveys.length === 0) {
        return noContent();
      }

      return ok(surveys);
    } catch (error) {
      return serverError(error);
    }
  }
}
