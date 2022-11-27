import { Validation } from "presentation/protocols";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "./add-survey-controller-protocols";

export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation) {}

  handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body);
    return null;
  }
}
