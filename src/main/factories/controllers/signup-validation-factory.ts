import { EmailValidatorAdapter } from "../../../infra/validators";
import { Validation } from "../../../presentation/protocols";
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../validation/validators";
import { MaxLengthValidation } from "../../../validation/validators/max-length-validation";
import { MinLengthValidation } from "../../../validation/validators/min-length-validation";
import { PatternValidation } from "../../../validation/validators/pattern-validation";

export const makeSignUpValidation = (): ValidationComposite => {
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
  validations.push(new EmailValidation("email", new EmailValidatorAdapter()));
  const validationComposite = new ValidationComposite(validations);
  return validationComposite;
};
