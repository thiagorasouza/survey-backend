import { Authentication } from "../../domain/usecases";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../helpers/http-helper";
import { Controller, HttpResponse, Validation } from "../protocols";

export interface LoginRequest {
  email: string;
  password: string;
}

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle(request: LoginRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }

      const { email, password } = request;

      const authenticationModel = await this.authentication.auth({
        email,
        password,
      });
      if (!authenticationModel) {
        return unauthorized();
      }

      return ok(authenticationModel);
    } catch (error) {
      console.log(error);
      return serverError(error);
    }
  }
}
