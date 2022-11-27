import { InvalidParamError } from "../../presentation/errors";
import { EmailValidator } from "../protocols/email-validator";
import { Validation } from "../../presentation/protocols";

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate(input: unknown): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName]);
    if (!isValid) {
      return new InvalidParamError(input[this.fieldName]);
    }
  }
}
