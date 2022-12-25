import { AddAccount, Authentication } from "../../domain/usecases";
import { EmailInUseError } from "../errors";
import { badRequest, forbidden, ok, serverError } from "../helpers/http-helper";
import { Controller, HttpResponse, Validation } from "../protocols";

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle(request: SignUpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }

      const { name, email, password } = request;

      const account = await this.addAccount.add({ name, email, password });
      if (!account) {
        return forbidden(new EmailInUseError());
      }

      const authenticationModel = await this.authentication.auth({
        email,
        password,
      });

      return ok(authenticationModel);
    } catch (error) {
      return serverError(error);
    }
  }
}
