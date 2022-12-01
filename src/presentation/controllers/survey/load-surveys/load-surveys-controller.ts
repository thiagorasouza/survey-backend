import { LoadSurveys } from "../../../../domain/usecases/load-surveys";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../add-survey/add-survey-controller-protocols";

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveys.load();
    return;
  }
}
