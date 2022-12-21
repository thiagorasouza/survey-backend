import { LogErrorRepository } from "../../data/protocols/db/log/log-error-repository";
import { mockLogErrorRepositoryStub } from "../../data/test";
import { mockAccountModel } from "../../domain/test";
import { ok, serverError } from "../../presentation/helpers/http/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log-controller-decorator";

const mockController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(): Promise<HttpResponse> {
      return ok(mockAccountModel());
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
  const logErrorRepositoryStub = mockLogErrorRepositoryStub();
  const controllerStub = mockController();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  );

  return { sut, controllerStub, logErrorRepositoryStub };
};

const mockRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});

const mockServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = "any_stack";
  return serverError(fakeError);
};

describe("LogController Decorator", () => {
  it("should call the wrapped controller", async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  it("should return the result of the controller", async () => {
    const { sut } = makeSut();
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(mockAccountModel()));
  });

  it("should call LogErrorRepositoy on server error with correct value", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

    const fakeServerError = mockServerError();
    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(Promise.resolve(fakeServerError));
    const logSpy = jest.spyOn(logErrorRepositoryStub, "logError");

    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(logSpy).toHaveBeenCalledWith(fakeServerError.body.stack);
  });
});
