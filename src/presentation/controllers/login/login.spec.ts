import { Authentication } from "../../../domain/usecases/authentication";
import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, serverError } from "../../helpers/http-helper";
import { EmailValidator, HttpRequest } from "../../protocols";
import { LoginController } from "./login";

interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(): Promise<string> {
      return "any_token";
    }
  }

  return new AuthenticationStub();
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication();
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub, authenticationStub);
  return { sut, emailValidatorStub, authenticationStub };
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any_email",
    password: "any_password",
  },
});

describe("Login Controller", () => {
  it("should return 400 is no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        // email: "any_email",
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  it("should return 400 is no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email",
        // password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });

  it("should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledTimes(1);
    expect(isValidSpy).toHaveBeenCalledWith("any_email");
  });

  it("should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
  });

  it("should return 500 if an EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it("should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();

    const authSpy = jest.spyOn(authenticationStub, "auth");

    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(authSpy).toHaveBeenCalledTimes(1);
    expect(authSpy).toHaveBeenCalledWith(
      httpRequest.body.email,
      httpRequest.body.password
    );
  });
});
