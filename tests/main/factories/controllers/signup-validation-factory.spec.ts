import { makeSignUpValidation } from "../../../../src/main/factories/controllers";
import { Validation } from "../../../../src/presentation/protocols";
import { EmailValidator } from "../../../../src/validation/protocols/email-validator";
import {
  RequiredFieldValidation,
  CompareFieldsValidation,
  EmailValidation,
  ValidationComposite,
} from "../../../../src/validation/validators";
import { MaxLengthValidation } from "../../../../src/validation/validators/max-length-validation";
import { MinLengthValidation } from "../../../../src/validation/validators/min-length-validation";
import { PatternValidation } from "../../../../src/validation/validators/pattern-validation";

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

describe("SignUpValidation Factory", () => {
  it("should call validation composite with all validations", () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ["name", "email", "password", "passwordConfirmation"]) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(
      new MinLengthValidation("name", 2),
      new MaxLengthValidation("name", 64),
      new PatternValidation("name", /^[A-zÀ-ú]{2,} ?[A-zÀ-ú ]*$/u)
    );
    validations.push(
      new MinLengthValidation("password", 8),
      new MaxLengthValidation("password", 64),
      new PatternValidation("password", /^(?=.*[A-Za-z])(?=.*\d).*$/)
    );
    validations.push(
      new CompareFieldsValidation("password", "passwordConfirmation")
    );
    validations.push(new EmailValidation("email", makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
