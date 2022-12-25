import { EmailValidatorAdapter } from "../../../infra/validators";
import { Validation } from "../../../presentation/protocols";
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../validation/validators";

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["email", "password"]) {
    validations.push(new RequiredFieldValidation(field));
  }
  const validationComposite = new ValidationComposite(validations);
  validations.push(new EmailValidation("email", new EmailValidatorAdapter()));
  return validationComposite;
};
