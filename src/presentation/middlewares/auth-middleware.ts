import { LoadAccountByToken } from "../../domain/usecases/load-account-by-token";
import { AccessDeniedError } from "../errors/access-denied-error";
import { forbidden, ok } from "../helpers/http/http-helper";
import { HttpRequest, HttpResponse, Middleware } from "../protocols";

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.["X-Access-Token"];
    if (!accessToken) {
      return forbidden(new AccessDeniedError());
    }

    const account = await this.loadAccountByToken.load(
      httpRequest.headers["X-Access-Token"]
    );

    if (!account) {
      return forbidden(new AccessDeniedError());
    }

    return ok({ accountId: account.id });
  }
}
