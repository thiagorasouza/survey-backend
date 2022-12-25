import { AddAccount, Authentication } from "../../../src/domain/usecases";
import {
  SignUpController,
  SignUpRequest,
} from "../../../src/presentation/controllers/signup-controller";
import {
  MissingParamError,
  EmailInUseError,
} from "../../../src/presentation/errors";
import {
  ok,
  serverError,
  badRequest,
  forbidden,
} from "../../../src/presentation/helpers/http-helper";
import { Validation } from "../../../src/presentation/protocols";
import {
  mockAuthentication,
  mockAddAccount,
  mockAuthenticationModel,
} from "../../domain/mocks";
import { mockValidation } from "../mocks";

interface SutTypes {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
  authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthentication();
  const addAccountStub = mockAddAccount();
  const validationStub = mockValidation();
  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub
  );

  return { sut, addAccountStub, validationStub, authenticationStub };
};

const mockRequest = (): SignUpRequest => ({
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
  passwordConfirmation: "any_password",
});

describe("SignUp Controller", () => {
  test("Should call AddAccount with correct values", async () => {
    const { sut, addAccountStub } = makeSut();

    const addSpy = jest.spyOn(addAccountStub, "add");

    const request = mockRequest();
    await sut.handle(request);

    expect(addSpy).toHaveBeenCalledTimes(1);
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
  });

  test("Should return 500 if EmailValidator throws", async () => {
    const { sut, addAccountStub } = makeSut();
    const fakeError = new Error();

    jest
      .spyOn(addAccountStub, "add")
      .mockImplementation(() => Promise.reject(fakeError));

    const request = mockRequest();
    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(serverError(fakeError));
  });

  test("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();

    const validate = jest.spyOn(validationStub, "validate");

    const request = mockRequest();
    await sut.handle(request);

    expect(validate).toHaveBeenCalledWith(request);
  });

  test("Should return 400 if Validation return an error", async () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"));

    const request = mockRequest();
    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("any_field"))
    );
  });

  it("should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();

    const authSpy = jest.spyOn(authenticationStub, "auth");

    const request = mockRequest();
    await sut.handle(request);

    expect(authSpy).toHaveBeenCalledTimes(1);
    expect(authSpy).toHaveBeenCalledWith({
      email: request.email,
      password: request.password,
    });
  });

  it("should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, "auth").mockImplementationOnce(async () => {
      throw new Error();
    });

    const request = mockRequest();
    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it("should return 403 if AddAccount returns null", async () => {
    const { sut, addAccountStub } = makeSut();

    jest
      .spyOn(addAccountStub, "add")
      .mockReturnValueOnce(Promise.resolve(null));

    const request = mockRequest();
    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  it("should return name and access token if valid credentials are provided", async () => {
    const { sut } = makeSut();

    const request = mockRequest();
    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(ok(mockAuthenticationModel()));
  });
});
