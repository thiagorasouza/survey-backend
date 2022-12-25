import { Authentication } from "../../../src/domain/usecases";
import { LoginController } from "../../../src/presentation/controllers/login-controller";
import { MissingParamError } from "../../../src/presentation/errors";
import {
  ok,
  unauthorized,
  serverError,
  badRequest,
} from "../../../src/presentation/helpers/http-helper";
import { Validation, HttpRequest } from "../../../src/presentation/protocols";
import {
  mockAuthentication,
  mockAuthenticationModel,
} from "../../domain/mocks";
import { mockValidation } from "../mocks";

interface SutTypes {
  sut: LoginController;
  authenticationStub: Authentication;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthentication();
  const validationStub = mockValidation();
  const sut = new LoginController(authenticationStub, validationStub);
  return { sut, validationStub, authenticationStub };
};

const mockRequest = (): HttpRequest => ({
  body: {
    email: "any_email",
    password: "any_password",
  },
});

describe("Login Controller", () => {
  it("should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();

    const authSpy = jest.spyOn(authenticationStub, "auth");

    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(authSpy).toHaveBeenCalledTimes(1);
    expect(authSpy).toHaveBeenCalledWith({
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  it("should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut();

    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(Promise.resolve(null));

    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(unauthorized());
  });

  it("should return 500 if Authenticaiton throws", async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(Promise.reject(new Error()));
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validate = jest.spyOn(validationStub, "validate");
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(validate).toHaveBeenCalledWith(httpRequest.body);
  });

  test("Should return 400 if Validation return an error", async () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"));
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("any_field"))
    );
  });

  it("should return 200 if valid credentials are provided", async () => {
    const { sut } = makeSut();

    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(ok(mockAuthenticationModel()));
  });
});
