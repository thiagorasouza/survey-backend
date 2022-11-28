import { AccessDeniedError } from "../errors/access-denied-error";
import { forbidden } from "../helpers/http/http-helper";
import { AuthMiddleware } from "./auth-middleware";

interface SutTypes {
  sut: AuthMiddleware;
}

const makeSut = (): SutTypes => {
  const sut = new AuthMiddleware();
  return { sut };
};

describe("Auth Middleware", () => {
  it("should return 403 if no X-Access-Token exists in headers", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
});
