import {
  LoadAccountByToken,
  HttpRequest,
  HttpResponse,
  Middleware,
} from "./auth-middleware-protocols";
import { AccessDeniedError } from "../errors/access-denied-error";
import { forbidden, ok, serverError } from "../helpers/http/http-helper";

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.["x-access-token"];
      if (!accessToken) {
        return forbidden(new AccessDeniedError());
      }

      const account = await this.loadAccountByToken.load(
        httpRequest.headers["x-access-token"],
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
