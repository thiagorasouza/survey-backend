import { LoadAccountByToken } from "../../../src/domain/usecases";
import {
  ok,
  serverError,
  unauthorized,
} from "../../../src/presentation/helpers/http-helper";
import {
  AuthMiddleware,
  AuthRequest,
} from "../../../src/presentation/middlewares/auth-middleware";
import { mockLoadAccountByTokenRequestModel } from "../../data/mocks";
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

const mockRequest = (): AuthRequest => ({
  accessToken: "any_token",
});

describe("Auth Middleware", () => {
  it("should return 401 if no accessToken is passed", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(unauthorized());
  });

  it("should call LoadAccountByToken with correct values", async () => {
    const role = "any_role";
    const { sut, loadAccountByTokenStub } = makeSut(role);

    const loadSpy = jest.spyOn(loadAccountByTokenStub, "load");

    const request = mockRequest();
    await sut.handle(request);

    const requestModel = mockLoadAccountByTokenRequestModel();
    expect(loadSpy).toHaveBeenCalledWith(requestModel);
  });

  it("should return 401 if LoadAccountByToken returns null", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, "load")
      .mockReturnValueOnce(Promise.resolve(null));

    const request = mockRequest();
    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(unauthorized());
  });

  it("should return 500 if LoadAccountByToken throws", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, "load")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const request = mockRequest();
    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it("should return 200 if LoadAccountByToken returns an account", async () => {
    const { sut } = makeSut();

    const request = mockRequest();
    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(ok({ accountId: "any_id" }));
  });
});
