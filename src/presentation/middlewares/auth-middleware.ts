import {
  LoadAccountByToken,
  LoadAccountByTokenRequestModel,
} from "../../domain/usecases";
import { AccessDeniedError } from "../errors";
import {
  forbidden,
  ok,
  serverError,
  unauthorized,
} from "../helpers/http-helper";
import { HttpResponse, Middleware } from "../protocols";

export interface AuthRequest {
  accessToken?: string;
}

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle(request: AuthRequest): Promise<HttpResponse> {
    try {
      const { accessToken } = request;
      if (!accessToken) {
        return unauthorized();
      }

      const requestModel: LoadAccountByTokenRequestModel = {
        accessToken,
        role: this.role,
      };

      const account = await this.loadAccountByToken.load(requestModel);

      if (!account) {
        return unauthorized();
      }

      return ok({ accountId: account.id });
    } catch (error) {
      return serverError(error);
    }
  }
}
