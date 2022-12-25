import { makeLoginValidation } from "../../../../src/main/factories/controllers";
import { Validation } from "../../../../src/presentation/protocols";
import { EmailValidator } from "../../../../src/validation/protocols/email-validator";
import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
} from "../../../../src/validation/validators";

jest.mock("../../../../src/validation/validators/validation-composite");

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
