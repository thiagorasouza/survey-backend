import { InvalidParamError } from "../../../src/presentation/errors";
import { EmailValidation } from "../../../src/validation/validators/email-validation";
import { EmailValidator } from "../../../src/validation/protocols/email-validator";
import { mockEmailValidator } from "../mocks";

interface SutTypes {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidator();
  const sut = new EmailValidation("email", emailValidatorStub);

  return { sut, emailValidatorStub };
};

describe("Email Validation", () => {
  test("Should return an error if EmailValidator returns false", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const error = sut.validate({ email: "any_email" });
    expect(error).toEqual(new InvalidParamError("any_email"));
  });

  test("Should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    sut.validate({ email: "any_email" });
    expect(isValidSpy).toHaveBeenCalledWith("any_email");
  });

  test("Should throw if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    // emailValid
    jest.spyOn(emailValidatorStub, "isValid").mockImplementation(() => {
      throw new Error();
    });
    expect(() => sut.validate("any_email")).toThrow();
  });
});
