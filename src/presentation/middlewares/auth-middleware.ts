import { LoadAccountByToken } from "../../domain/usecases";
import { AccessDeniedError } from "../errors";
import { forbidden, ok, serverError } from "../helpers/http-helper";
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
        return forbidden(new AccessDeniedError());
      }

      const account = await this.loadAccountByToken.load(
        accessToken,
        this.role
      );

      if (!account) {
        return forbidden(new AccessDeniedError());
      }

      return ok({ accountId: account.id });
    } catch (error) {
      return serverError(error);
    }
  }
}
