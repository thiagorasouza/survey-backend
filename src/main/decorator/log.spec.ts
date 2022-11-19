import { LogErrorRepository } from "../../data/protocols/log-error-repository";
import { serverError } from "../../presentation/helpers/http-helper";
import { Controller, HttpResponse } from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(): Promise<void> {
      return null;
    }
  }

  return new LogErrorRepositoryStub();
};

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle(): Promise<HttpResponse> {
      return {
        statusCode: 200,
        body: {
          name: "John",
        },
      };
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

describe("LogController Decorator", () => {
  it("should call the wrapped controller", async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  it("should return the result of the controller", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: "John",
      },
    });
  });

  it("should call LogErrorRepositoy on server error with correct value", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

    const fakeError = new Error();
    fakeError.stack = "any_stack";
    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(Promise.resolve(serverError(fakeError)));
    const logSpy = jest.spyOn(logErrorRepositoryStub, "log");

    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    await sut.handle(httpRequest);

    expect(logSpy).toHaveBeenCalledWith(fakeError.stack);
  });
});
