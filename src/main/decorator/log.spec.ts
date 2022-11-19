import { LogErrorRepository } from "../../data/protocols/log-error-repository";
import { AccountModel } from "../../domain/models/account";
import { ok, serverError } from "../../presentation/helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(): Promise<void> {
      return null;
    }
  }

  return new LogErrorRepositoryStub();
};

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle(): Promise<HttpResponse> {
      return ok(makeFakeAccount());
    }
  }

  return new ControllerStub();
};

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeSut = (): SutTypes => {
  const logErrorRepositoryStub = makeLogErrorRepositoryStub();
  const controllerStub = makeControllerStub();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  );

  return { sut, controllerStub, logErrorRepositoryStub };
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "valid_password",
});

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = "any_stack";
  return serverError(fakeError);
};

describe("LogController Decorator", () => {
  it("should call the wrapped controller", async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  it("should return the result of the controller", async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  it("should call LogErrorRepositoy on server error with correct value", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

    const fakeServerError = makeFakeServerError();
    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(Promise.resolve(fakeServerError));
    const logSpy = jest.spyOn(logErrorRepositoryStub, "logError");

    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(logSpy).toHaveBeenCalledWith(fakeServerError.body.stack);
  });
});
