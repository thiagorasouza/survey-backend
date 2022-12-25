import { LoadAccountByToken } from "../../../src/domain/usecases";
import { AccessDeniedError } from "../../../src/presentation/errors";
import {
  ok,
  forbidden,
  serverError,
} from "../../../src/presentation/helpers/http-helper";
import { AuthMiddleware } from "../../../src/presentation/middlewares/auth-middleware";
import { HttpRequest } from "../../../src/presentation/protocols";
import { mockLoadAccountByToken } from "../../domain/mocks";

interface SutTypes {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub, role);
  return { sut, loadAccountByTokenStub };
};

const mockRequest = (): HttpRequest => ({
  headers: {
    "x-access-token": "any_token",
  },
});

describe("Auth Middleware", () => {
  it("should return 403 if no x-access-token exists in headers", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it("should call LoadAccountByToken with correct values", async () => {
    const role = "any_role";
    const { sut, loadAccountByTokenStub } = makeSut(role);
    const loadSpy = jest.spyOn(loadAccountByTokenStub, "load");
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(loadSpy).toHaveBeenCalledWith("any_token", role);
  });

  it("should return 403 if LoadAccountByToken returns null", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, "load")
      .mockReturnValueOnce(Promise.resolve(null));

    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it("should return 200 if LoadAccountByToken returns an account", async () => {
    const { sut } = makeSut();

    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(ok({ accountId: "any_id" }));
  });

  it("should return 500 if LoadAccountByToken throws", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, "load")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
