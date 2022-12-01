import { LoadSurveys } from "../../../../domain/usecases/load-surveys";
import { ok } from "../../../helpers/http/http-helper";
import {
  Controller,
  HttpResponse,
} from "../add-survey/add-survey-controller-protocols";

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handle(): Promise<HttpResponse> {
    const surveys = await this.loadSurveys.load();
    return ok(surveys);
  }
}
