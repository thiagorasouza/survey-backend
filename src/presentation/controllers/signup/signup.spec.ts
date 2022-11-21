import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "../../errors";
import {
  EmailValidator,
  AccountModel,
  AddAccount,
  AddAccountModel,
  HttpRequest,
  Validation,
} from "./signup-protocols";
import { SignUpController } from "./signup";
import { badRequest, ok, serverError } from "../../helpers/http-helper";

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount();
      return Promise.resolve(fakeAccount);
    }
  }

  return new AddAccountStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: unknown): Error {
      return null;
    }
  }

  return new ValidationStub();
};

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(
    emailValidatorStub,
    addAccountStub,
    validationStub
  );

  return { sut, emailValidatorStub, addAccountStub, validationStub };
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

describe("SignUp Controller", () => {
  // test("Should return 400 if no name is provided", async () => {
  //   const { sut } = makeSut();
  //   const httpRequest = {
  //     body: {
  //       // name: 'any_name',
  //       email: "any_email@mail.com",
  //       password: "any_password",
  //       passwordConfirmation: "any_password",
  //     },
  //   };
  //   const httpResponse = await sut.handle(httpRequest);

  //   expect(httpResponse).toEqual(badRequest(new MissingParamError("name")));
  // });

  // test("Should return 400 if no email is provided", async () => {
  //   const { sut } = makeSut();
  //   const httpRequest = {
  //     body: {
  //       name: "any_name",
  //       // email: "any_email@mail.com",
  //       password: "any_password",
  //       passwordConfirmation: "any_password",
  //     },
  //   };
  //   const httpResponse = await sut.handle(httpRequest);
  //   expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  // });

  // test("Should return 400 if no password is provided", async () => {
  //   const { sut } = makeSut();
  //   const httpRequest = {
  //     body: {
  //       name: "any_name",
  //       email: "any_email@mail.com",
  //       // password: "any_password",
  //       passwordConfirmation: "any_password",
  //     },
  //   };
  //   const httpResponse = await sut.handle(httpRequest);
  //   expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  // });

  // test("Should return 400 if no password confirmation is provided", async () => {
  //   const { sut } = makeSut();
  //   const httpRequest = {
  //     body: {
  //       name: "any_name",
  //       email: "any_email@mail.com",
  //       password: "any_password",
  //       // passwordConfirmation: "any_password",
  //     },
  //   };
  //   const httpResponse = await sut.handle(httpRequest);
  //   expect(httpResponse).toEqual(
  //     badRequest(new MissingParamError("passwordConfirmation"))
  //   );
  // });

  test("Should return 400 if password confirmation fails", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "other_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError("passwordConfirmation"))
    );
  });

  test("Should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
  });

  test("Should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  test("Should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    // emailValid
    jest
      .spyOn(emailValidatorStub, "isValid")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .mockImplementation((email: string): boolean => {
        throw new Error();
      });
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test("Should call AddAccount with correct values", async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "add");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledTimes(1);
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
  });

  test("Should return 500 if EmailValidator throws", async () => {
    const { sut, addAccountStub } = makeSut();
    // emailValid
    jest
      .spyOn(addAccountStub, "add")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .mockImplementation(() => Promise.reject(new Error()));
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test("Should return 200 if valid data is provided", async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  test("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validate = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validate).toHaveBeenCalledWith(httpRequest.body);
  });

  test("Should return 400 if Validation return an error", async () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"));
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("any_field"))
    );
  });
});
