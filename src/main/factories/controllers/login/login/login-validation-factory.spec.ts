import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../../../validation/validators";
import { EmailValidator } from "../../../../../validation/protocols/email-validator";
import { Validation } from "../../../../../presentation/protocols/validation";
import { makeLoginValidation } from "./login-validation-factory";

jest.mock("../../../../../validation/validators/validation-composite");

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe("LoginValidation Factory", () => {
  it("should call validation composite with all validations", () => {
    makeLoginValidation();
    const validations: Validation[] = [];
    for (const field of ["email", "password"]) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation("email", makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
